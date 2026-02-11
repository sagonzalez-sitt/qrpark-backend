import {Injectable} from '@nestjs/common';
import {PrismaService} from '../../prisma/prisma.service';
import {DashboardStatsDto} from './dto/dashboard-stats.dto';
import {TicketStatus} from '../../interfaces/enums';
import {formatDuration} from "../../utils/formats";

@Injectable()
export class StatisticsService
{
    constructor(private readonly prismaService: PrismaService) {}

    async getDashboardStats(): Promise<DashboardStatsDto>
    {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const activeTicketsCount = await this.prismaService.parking_tickets.count({
            where: {status: TicketStatus.ACTIVE},
        });

        const completedToday = await this.prismaService.parking_tickets.findMany({
            where: {
                status: TicketStatus.PAID,
                exit_timestamp: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });

        const dailyRevenue = completedToday.reduce((sum, ticket) => {
            const fee = ticket.calculated_fee ? parseFloat(ticket.calculated_fee.toString()) : 0;
            return sum + fee;
        }, 0);

        const dailyEntries = await this.prismaService.parking_tickets.count({
            where: {
                entry_timestamp: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });

        let averageStayMs = 0;

        if (completedToday.length > 0)
        {
            const totalStayMs = completedToday.reduce((sum, ticket) =>
            {
                if (ticket.exit_timestamp)
                {
                    const duration = ticket.exit_timestamp.getTime() - ticket.entry_timestamp.getTime();
                    return sum + duration;
                }
                return sum;
            }, 0);
            averageStayMs = Math.floor(totalStayMs / completedToday.length);
        }

        const carCount = await this.prismaService.parking_tickets.count({
            where: {status: TicketStatus.ACTIVE, vehicle_type: 'CAR'},
        });

        const motorcycleCount = await this.prismaService.parking_tickets.count({
            where: {status: TicketStatus.ACTIVE, vehicle_type: 'MOTORCYCLE'},
        });

        const bicycleCount = await this.prismaService.parking_tickets.count({
            where: {status: TicketStatus.ACTIVE, vehicle_type: 'BICYCLE'},
        });

        const deliveryStats = await this.prismaService.parking_tickets.groupBy({
            by: ['delivery_method'],
            where: {
                entry_timestamp: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            _count: true,
        });

        const deliveryMethodDistribution = {
            digitalPhoto: 0,
            digitalDownload: 0,
            printed: 0,
            unknown: 0,
        };

        deliveryStats.forEach((stat) =>
        {
            switch (stat.delivery_method)
            {
                case 'DIGITAL_PHOTO':
                    deliveryMethodDistribution.digitalPhoto = stat._count;
                    break;
                case 'DIGITAL_DOWNLOAD':
                    deliveryMethodDistribution.digitalDownload = stat._count;
                    break;
                case 'PRINTED':
                    deliveryMethodDistribution.printed = stat._count;
                    break;
                case 'UNKNOWN':
                    deliveryMethodDistribution.unknown = stat._count;
                    break;
            }
        });

        return {
            activeTickets: activeTicketsCount,
            dailyRevenue: Math.round(dailyRevenue * 100) / 100,
            dailyEntries,
            averageStayMs,
            averageStayFormatted: formatDuration(averageStayMs),
            distribution: {cars: carCount, motorcycles: motorcycleCount, bicycles: bicycleCount},
            deliveryMethodDistribution,
        };
    }

    async getStatsByDateRange(startDate: Date, endDate: Date)
    {
        const tickets = await this.prismaService.parking_tickets.findMany({
            where: {
                entry_timestamp: {gte: startDate, lte: endDate},
            },
        });

        const completedTickets =
            tickets.filter((t) => t.status === TicketStatus.PAID);

        const totalRevenue = completedTickets.reduce((sum, ticket) =>
        {
            const fee = ticket.calculated_fee ? parseFloat(ticket.calculated_fee.toString()) : 0;
            return sum + fee;
        }, 0);

        return {
            totalTickets: tickets.length,
            completedTickets: completedTickets.length,
            activeTickets: tickets.filter((t) => t.status === TicketStatus.ACTIVE).length,
            totalRevenue: Math.round(totalRevenue * 100) / 100,
        };
    }
}
