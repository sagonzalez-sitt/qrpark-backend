import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import {TicketsService} from './tickets.service';
import {CreateTicketDto} from './dto/create-ticket.dto';
import {UpdateTicketDto} from './dto/update-ticket.dto';
import {TicketFilters} from "../../interfaces/filters";
import {UpdateDeliveryDto} from "./dto/update-delivery.dto";
import {ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery} from '@nestjs/swagger';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController
{
    constructor(private readonly ticketsService: TicketsService) {}

    @Get()
    @ApiOperation({ summary: 'Listar todos los tickets con filtros opcionales' })
    @ApiResponse({ status: 200, description: 'Lista de tickets obtenida exitosamente' })
    async findAll(@Query() filters: TicketFilters)
    {
        return await this.ticketsService.findAll(filters);
    }

    @Get('active')
    @ApiOperation({ summary: 'Obtener tickets activos (vehículos en parqueadero)' })
    @ApiResponse({ status: 200, description: 'Lista de tickets activos' })
    async findActiveTickets()
    {
        return await this.ticketsService.findActiveTickets();
    }

    @Get('token/:token')
    @ApiOperation({ summary: 'Buscar ticket por token QR' })
    @ApiParam({ name: 'token', description: 'Token hexadecimal del QR (32 caracteres)' })
    @ApiResponse({ status: 200, description: 'Ticket encontrado' })
    @ApiResponse({ status: 404, description: 'Ticket no encontrado' })
    async findByToken(@Param('token') token: string)
    {
        return await this.ticketsService.findByToken(token);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener ticket por ID' })
    @ApiParam({ name: 'id', description: 'ID del ticket (UUID)' })
    @ApiResponse({ status: 200, description: 'Ticket encontrado' })
    @ApiResponse({ status: 404, description: 'Ticket no encontrado' })
    async findOne(@Param('id') id: string)
    {
        return await this.ticketsService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Crear nuevo ticket de entrada' })
    @ApiResponse({ status: 201, description: 'Ticket creado exitosamente' })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    async create(@Body() data: CreateTicketDto)
    {
        return await this.ticketsService.create(data);
    }

    @Post(':token/exit')
    @ApiOperation({ summary: 'Procesar salida del vehículo y calcular tarifa' })
    @ApiParam({ name: 'token', description: 'Token QR del ticket' })
    @ApiResponse({ status: 200, description: 'Salida procesada exitosamente con tarifa calculada' })
    @ApiResponse({ status: 400, description: 'Ticket no está activo o ya procesado' })
    @ApiResponse({ status: 404, description: 'Ticket no encontrado' })
    async processExit(@Param('token') token: string)
    {
        return await this.ticketsService.processExit(token);
    }

    @Post(':id/pay')
    @ApiOperation({ summary: 'Marcar ticket como pagado' })
    @ApiParam({ name: 'id', description: 'ID del ticket' })
    @ApiResponse({ status: 200, description: 'Pago registrado exitosamente' })
    @ApiResponse({ status: 404, description: 'Ticket no encontrado' })
    async markAsPaid(@Param('id') id: string)
    {
        return await this.ticketsService.markAsPaid(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar ticket' })
    @ApiParam({ name: 'id', description: 'ID del ticket' })
    @ApiResponse({ status: 200, description: 'Ticket actualizado' })
    @ApiResponse({ status: 404, description: 'Ticket no encontrado' })
    async update(@Param('id') id: string, @Body() data: UpdateTicketDto) {
        return await this.ticketsService.update(id, data);
    }

    @Patch(':token/delivery')
    @ApiOperation({ summary: 'Actualizar método de entrega del ticket (foto/descarga/impreso)' })
    @ApiParam({ name: 'token', description: 'Token QR del ticket' })
    @ApiResponse({ status: 200, description: 'Método de entrega actualizado' })
    @ApiResponse({ status: 404, description: 'Ticket no encontrado' })
    async updateDeliveryMethod(@Param('token') token: string, @Body() data: UpdateDeliveryDto)
    {
        return await this.ticketsService.updateDeliveryMethod(token, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Cancelar ticket' })
    @ApiParam({ name: 'id', description: 'ID del ticket' })
    @ApiResponse({ status: 200, description: 'Ticket cancelado' })
    @ApiResponse({ status: 404, description: 'Ticket no encontrado' })
    async cancel(@Param('id') id: string)
    {
        return await this.ticketsService.cancel(id);
    }
}
