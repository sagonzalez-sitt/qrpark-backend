import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateTicketDto} from './dto/create-ticket.dto';
import {UpdateTicketDto} from './dto/update-ticket.dto';
import {PricingService} from "../pricing/pricing.service";
import {randomBytes} from "node:crypto";
import {TicketDeliveryMethod, TicketStatus, VehicleType} from "../../interfaces/enums";
import {UpdateDeliveryDto} from "./dto/update-delivery.dto";
import {TicketEntity} from "./entities/ticket.entity";
import {TicketResponseDto} from "./dto/ticket-response.dto";
import {TicketFilters} from "../../interfaces/filters";
import {formatDuration} from "../../utils/formats";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TicketsService
{
    constructor(
        private readonly prismaService: PrismaService,
        private readonly pricingService: PricingService
    ) {}

    async findAll(filters?: TicketFilters): Promise<TicketEntity[]>
    {
        const where: any = {};

        if (filters)
        {
            if (filters.status) where.status = filters.status;
            if (filters.vehicle_type) where.vehicle_type = filters.vehicle_type;
            if (filters.delivery_method) where.delivery_method = filters.delivery_method;
            if (filters.plate_number) where.plate_number = { contains: filters.plate_number.toUpperCase() };
        }

        return this.prismaService.parking_tickets.findMany({
            where,
            orderBy: { entry_timestamp: 'desc' },
        });
    }

    async findActiveTickets(): Promise<TicketEntity[]>
    {
        return this.prismaService.parking_tickets.findMany({
            where: { status: TicketStatus.ACTIVE },
            orderBy: { entry_timestamp: 'desc' },
        });
    }

    async findOne(id: string): Promise<TicketEntity | null>
    {
        const ticket = await this.prismaService.parking_tickets.findUnique({
            where: { id: id }
        });

        if (!ticket) throw new Error('Parking ticket not found for the provided ID');

        return ticket;
    }

    async findByToken(qrToken: string): Promise<TicketEntity | null>
    {
        const ticket = await this.prismaService.parking_tickets.findUnique({
            where: { qr_token: qrToken }
        });

        if (!ticket) throw new Error('Parking ticket not found for the provided QR token');

        return ticket;
    }

    async create(createTicketDto: CreateTicketDto): Promise<TicketEntity>
    {
        const plateNumber = createTicketDto.plate_number.toUpperCase();

        // Validar que no exista un ticket activo con la misma placa
        const existingActiveTicket = await this.prismaService.parking_tickets.findFirst({
            where: {
                plate_number: plateNumber,
                status: TicketStatus.ACTIVE
            }
        });

        if (existingActiveTicket) {
            throw new BadRequestException(
                `Ya existe un ticket activo para la placa ${plateNumber}. El vehículo debe salir primero antes de crear un nuevo ticket.`
            );
        }

        const pricingConfig = await this.pricingService.getPriceByVehicleType(createTicketDto.vehicle_type);
        if (!pricingConfig) {
            throw new BadRequestException(
                `No hay tarifa configurada para el tipo de vehículo ${createTicketDto.vehicle_type}. Configure una tarifa antes de registrar este tipo de vehículo.`
            );
        }

        const qrToken = this.generateQRToken();

        const ticket = await this.prismaService.parking_tickets.create({
            data: {
                id: randomBytes(16).toString('hex'),
                qr_token: qrToken,
                plate_number: plateNumber,
                vehicle_type: createTicketDto.vehicle_type,
                entry_timestamp: new Date(),
                status: TicketStatus.ACTIVE,
            }
        });

        if (!ticket) throw new Error('Error while creating a new parking ticket');

        return ticket;
    }

    async update(id: string, data: UpdateTicketDto): Promise<TicketEntity>
    {
        const ticket = this.prismaService.parking_tickets.update({
            where: { id: id },
            data: data,
        });

        if (!ticket) throw new Error(`Ticket with ID ${id} not found.`);

        return ticket;
    }

    async updateDeliveryMethod(qrToken: string, data: UpdateDeliveryDto): Promise<TicketEntity>
    {
        const ticket = await this.findByToken(qrToken);

        if (!ticket) throw new BadRequestException(`Ticket with token ${qrToken} not found.`);

        if (ticket.delivery_method === data.delivery_method)
            throw new BadRequestException(`
                Ticket with token ${qrToken} already has delivery method set to ${data.delivery_method}.
            `);

        const updateData: any = {
            delivery_method: data.delivery_method,
            delivered: true,
        };

        if (data.delivery_method === TicketDeliveryMethod.DIGITAL_DOWNLOAD)
            updateData.qr_downloaded_at = Date.now();
        else if (data.delivery_method === TicketDeliveryMethod.PRINTED)
            updateData.qr_printed_at = Date.now();

        return this.prismaService.parking_tickets.update({
            where: { qr_token: qrToken },
            data: updateData,
        });
    }

    async cancel(id: string): Promise<TicketEntity>
    {
        const ticket = await this.findOne(id);

        if (ticket?.status !== TicketStatus.ACTIVE)
            throw new BadRequestException(`Only active tickets can be cancelled.`);

        return this.prismaService.parking_tickets.update({
            where: { id: id },
            data: { status: TicketStatus.CANCELLED },
        });
    }

    async markAsPaid(id: string): Promise<TicketEntity>
    {
        const ticket = await this.findOne(id);

        if (!ticket)
            throw new BadRequestException(`Ticket with ID ${id} not found.`);

        if (ticket.status === TicketStatus.PAID)
            throw new BadRequestException(`Ticket is already marked as paid.`);

        if (ticket.status === TicketStatus.CANCELLED)
            throw new BadRequestException(`Cannot mark cancelled ticket as paid.`);

        return this.prismaService.parking_tickets.update({
            where: { id: id },
            data: { status: TicketStatus.PAID },
        });
    }

    async processExit(qrToken: string): Promise<TicketResponseDto>
    {
        const ticket = await this.findByToken(qrToken);

        if (!ticket)
            throw new BadRequestException(`No se encontró un ticket con el token proporcionado.`);

        if (ticket.status === TicketStatus.PAID)
            throw new BadRequestException(`El ticket ya fue pagado.`);

        if (ticket.status === TicketStatus.CANCELLED)
            throw new BadRequestException(`El ticket fue cancelado y no puede procesarse.`);

        if (ticket?.exit_timestamp && ticket?.calculated_fee)
        {
            const durationMs = ticket.exit_timestamp.getTime() - ticket.entry_timestamp.getTime();

            return {
                ...ticket,
                duration_ms: durationMs,
                duration_formatted: formatDuration(durationMs),
                fee_amount: parseFloat(ticket.calculated_fee.toString()),
            };
        }

        const exitTimestamp = new Date();

        const calculatedFee = await this.pricingService.calculateFee(
            ticket.vehicle_type as VehicleType,
            ticket.entry_timestamp,
            exitTimestamp
        );

        const updatedTicket = await this.prismaService.parking_tickets.update({
            where: { qr_token: qrToken },
            data: {
                exit_timestamp: exitTimestamp,
                calculated_fee: calculatedFee,
            }
        });

        const durationMs = exitTimestamp.getTime() - ticket.entry_timestamp.getTime();

        return {
            ...updatedTicket,
            duration_ms: durationMs,
            duration_formatted: formatDuration(durationMs),
            fee_amount: parseFloat(calculatedFee.toString()),
        };
    }

    private generateQRToken(): string
    {
        return randomBytes(16).toString('hex');
    }
}
