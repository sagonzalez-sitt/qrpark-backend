import {Injectable, BadRequestException} from '@nestjs/common';
import {CreatePricingDto} from './dto/create-pricing.dto';
import {UpdatePricingDto} from './dto/update-pricing.dto';
import {Decimal} from "@prisma/client/runtime/client";
import {PrismaService} from "../../prisma/prisma.service";
import {VehicleType} from "../../interfaces/enums";
import {PricingEntity} from "./entities/pricing.entity";

@Injectable()
export class PricingService
{
    constructor(private readonly prismaService: PrismaService) {}

    async calculateFee(vehicleType: VehicleType, entryTime: Date, exitTime: Date): Promise<Decimal>
    {
        const pricingConfig = await this.getPriceByVehicleType(vehicleType);

        if (!pricingConfig) {
            throw new BadRequestException(
                `No hay tarifa configurada para el tipo de vehículo ${vehicleType}. No se puede calcular la tarifa.`
            );
        }

        const diffInMs = exitTime.getTime() - entryTime.getTime();
        const minutes = Math.ceil(diffInMs / (1000 * 60));

        const pricePerHour = parseFloat(pricingConfig.price_per_hour.toString());
        const fee = Math.round((pricePerHour / 60) * minutes);

        return new Decimal(fee);
    }

    async getPriceByVehicleType(vehicleType: VehicleType)
    {
        return this.prismaService.pricing_config.findUnique({
            where: { vehicle_type: vehicleType }
        });
    }

    async findAll() : Promise<PricingEntity[]>
    {
        try
        {
            return this.prismaService.pricing_config.findMany({
                orderBy: { vehicle_type: 'asc' }
            });
        }
        catch (e)
        {
            throw new Error(`Error while retrieving the pricing config list. Message: ${e}` )
        }
    }

    async findOne(id: string) : Promise<PricingEntity | null>
    {
        try
        {
            return this.prismaService.pricing_config.findUnique({
                where: { id: id }
            });
        }
        catch (e)
        {
            throw new Error(`Error while retrieving the pricing config. Message: ${e}` )
        }
    }

    async create(data: CreatePricingDto) : Promise<PricingEntity>
    {
        try
        {
            const existing = await this.prismaService.pricing_config.findUnique({
                where: { vehicle_type: data.vehicle_type }
            });

            if (existing) {
                throw new BadRequestException(
                    `Ya existe una configuración de tarifa para el tipo de vehículo ${data.vehicle_type}.`
                );
            }

            return this.prismaService.pricing_config.create({
                data: data
            });
        }
        catch (e)
        {
            if (e instanceof BadRequestException) throw e;
            throw new Error(`Error while creating the pricing config. Message: ${e}` )
        }
    }

    async update(id: string, data: UpdatePricingDto) : Promise<PricingEntity>
    {
        try
        {
            return this.prismaService.pricing_config.update({
                where: { id: id },
                data: data
            });
        }
        catch (e)
        {
            throw new Error(`Error while updating the pricing config. Message: ${e}` )
        }
    }

    async remove(id: string) : Promise<PricingEntity>
    {
        try
        {
            return this.prismaService.pricing_config.delete({
                where: { id: id }
            });
        }
        catch (e)
        {
            throw new Error(`Error while deleting pricing config. Message: ${e}` )
        }
    }
}
