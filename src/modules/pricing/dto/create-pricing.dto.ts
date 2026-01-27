import {VehicleType} from "../../../interfaces/enums";
import {IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive} from "class-validator";
import {ApiProperty} from '@nestjs/swagger';

export class CreatePricingDto
{
    @IsEnum(VehicleType)
    @ApiProperty({description: 'Tipo de vehículo para esta configuración de precio', enum: VehicleType, example: VehicleType.CAR})
    vehicle_type: VehicleType;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    @ApiProperty({description: 'Precio por hora en la moneda local (máximo 2 decimales)', example: 5000, minimum: 0.01})
    price_per_hour: number;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({description: 'Indica si esta configuración de precio está activa', required: false, example: true, default: true})
    active?: boolean;
}
