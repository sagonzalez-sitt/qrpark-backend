import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {PricingService} from './pricing.service';
import {CreatePricingDto} from './dto/create-pricing.dto';
import {UpdatePricingDto} from './dto/update-pricing.dto';
import {ApiTags, ApiOperation, ApiResponse, ApiParam} from '@nestjs/swagger';

@ApiTags('pricing')
@Controller('pricing')
export class PricingController
{
    constructor(private readonly pricingService: PricingService) {}

    @Get()
    @ApiOperation({ summary: 'Listar todas las configuraciones de tarifas' })
    @ApiResponse({ status: 200, description: 'Lista de tarifas por tipo de vehículo' })
    findAll()
    {
        return this.pricingService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener configuración de tarifa por ID' })
    @ApiParam({ name: 'id', description: 'ID de la configuración (UUID)' })
    @ApiResponse({ status: 200, description: 'Configuración encontrada' })
    @ApiResponse({ status: 404, description: 'Configuración no encontrada' })
    findOne(@Param('id') id: string)
    {
        return this.pricingService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Crear nueva configuración de tarifa' })
    @ApiResponse({ status: 201, description: 'Configuración creada exitosamente' })
    @ApiResponse({ status: 400, description: 'Datos inválidos o tipo de vehículo ya configurado' })
    create(@Body() createPricingDto: CreatePricingDto)
    {
        return this.pricingService.create(createPricingDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar configuración de tarifa' })
    @ApiParam({ name: 'id', description: 'ID de la configuración' })
    @ApiResponse({ status: 200, description: 'Configuración actualizada' })
    @ApiResponse({ status: 404, description: 'Configuración no encontrada' })
    update(@Param('id') id: string, @Body() updatePricingDto: UpdatePricingDto)
    {
        return this.pricingService.update(id, updatePricingDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar configuración de tarifa' })
    @ApiParam({ name: 'id', description: 'ID de la configuración' })
    @ApiResponse({ status: 200, description: 'Configuración eliminada' })
    @ApiResponse({ status: 404, description: 'Configuración no encontrada' })
    remove(@Param('id') id: string)
    {
        return this.pricingService.remove(id);
    }
}
