import {Injectable} from '@nestjs/common';
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
        const diffInMs = exitTime.getTime() - entryTime.getTime();
        const hours = Math.ceil(diffInMs / (1000*60*60));

        return pricingConfig.price_per_hour.mul(hours);
    }

    async getPriceByVehicleType(vehicleType: VehicleType)
    {
        const priceConfig = await this.prismaService.pricing_config.findUnique({
            where: { vehicle_type: vehicleType }
        });

        if (!priceConfig)
        {
            throw new Error(`No pricing configuration found for vehicle type: ${vehicleType}`);
        }

        return priceConfig;
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
            return this.prismaService.pricing_config.create({
                data: data
            });
        }
        catch (e)
        {
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
