import {Injectable, BadRequestException, NotFoundException} from '@nestjs/common';
import {RegistrationSessionEntity} from './entities/registration-session.entity';
import {CompleteSessionDto} from './dto/complete-session.dto';
import {TicketsService} from '../tickets/tickets.service';
import {randomBytes} from 'crypto';
import {PrismaService} from "../../prisma/prisma.service";
import {RegistrationSessionStatus, VehicleType} from "../../interfaces/enums";

@Injectable()
export class RegistrationSessionsService
{
    constructor(
        private readonly prismaService: PrismaService,
        private readonly ticketsService: TicketsService,
    ) {
    }

    async create(): Promise<RegistrationSessionEntity>
    {
        const sessionToken = this.generateSessionToken();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);

        return this.prismaService.registration_sessions.create({
            data: {
                session_token: sessionToken,
                expires_at: expiresAt,
            },
        });
    }

    async findOne(sessionToken: string): Promise<RegistrationSessionEntity | null> {
        return this.prismaService.registration_sessions.findUnique({
            where: {session_token: sessionToken},
        });
    }

    async complete(
        sessionToken: string,
        data: CompleteSessionDto,
    ): Promise<{ session: RegistrationSessionEntity; ticket: any }>
    {
        const session = await this.findOne(sessionToken);

        if (!session) {
            throw new NotFoundException(`Session with token ${sessionToken} not found`);
        }

        if (session.status === RegistrationSessionStatus.COMPLETED) {
            throw new BadRequestException('Session already completed');
        }

        if (session.status === RegistrationSessionStatus.EXPIRED) {
            throw new BadRequestException('Session has expired');
        }

        if (new Date() > session.expires_at)
        {
            await this.prismaService.registration_sessions.update({
                where: {session_token: sessionToken},
                data: {status: RegistrationSessionStatus.EXPIRED},
            });
            throw new BadRequestException('Session has expired');
        }

        const ticket = await this.ticketsService.create({
            plate_number: data.plate_number,
            vehicle_type: data.vehicle_type as VehicleType,
        });

        const updatedSession = await this.prismaService.registration_sessions.update({
            where: {session_token: sessionToken},
            data: {
                status: RegistrationSessionStatus.COMPLETED,
                ticket_id: ticket.id,
                completed_at: new Date(),
            },
        });

        return {
            session: updatedSession,
            ticket,
        };
    }

    async cleanExpired(): Promise<number> {
        const result = await this.prismaService.registration_sessions.updateMany({
            where: {
                status: RegistrationSessionStatus.PENDING,
                expires_at: {
                    lt: new Date(),
                },
            },
            data: {
                status: RegistrationSessionStatus.EXPIRED,
            },
        });

        return result.count;
    }

    private generateSessionToken(): string {
        return randomBytes(16).toString('hex'); // 32 caracteres
    }
}
