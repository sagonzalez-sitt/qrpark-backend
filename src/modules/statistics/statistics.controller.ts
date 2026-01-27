import {Controller, Get, Query} from '@nestjs/common';
import {StatisticsService} from './statistics.service';
import {ApiTags, ApiOperation, ApiResponse, ApiQuery} from '@nestjs/swagger';

@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController
{
    constructor(private readonly statisticsService: StatisticsService) {}

    @Get('dashboard')
    @ApiOperation({
        summary: 'Obtener métricas del dashboard en tiempo real',
        description: 'Retorna tickets activos, ingresos del día, entradas del día, tiempo promedio de estadía y distribuciones por tipo de vehículo y método de entrega'
    })
    @ApiResponse({ status: 200, description: 'Estadísticas del dashboard obtenidas exitosamente' })
    async getDashboardStats()
    {
        return await this.statisticsService.getDashboardStats();
    }

    @Get('range')
    @ApiOperation({
        summary: 'Obtener estadísticas por rango de fechas',
        description: 'Retorna total de tickets, tickets completados, tickets activos e ingresos totales para un rango de fechas específico'
    })
    @ApiQuery({ name: 'startDate', description: 'Fecha de inicio (ISO 8601)', example: '2024-01-01' })
    @ApiQuery({ name: 'endDate', description: 'Fecha de fin (ISO 8601)', example: '2024-01-31' })
    @ApiResponse({ status: 200, description: 'Estadísticas por rango obtenidas exitosamente' })
    async getStatsByDateRange(@Query('startDate') startDate: string, @Query('endDate') endDate: string)
    {
        const start = new Date(startDate);
        const end = new Date(endDate);

        return await this.statisticsService.getStatsByDateRange(start, end);
    }
}
