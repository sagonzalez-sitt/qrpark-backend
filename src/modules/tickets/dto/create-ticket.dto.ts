import {IsBoolean, IsEnum, IsOptional, IsString, Matches} from "class-validator";
import {VehicleType} from "../../../interfaces/enums";
import {ApiProperty} from '@nestjs/swagger';

export class CreateTicketDto
{
    @IsString()
    @Matches(/^[A-Z0-9]{6,10}$/, {message: 'El número de placa debe tener entre 6 y 10 caracteres alfanuméricos (A-Z, 0-9).'})
    @ApiProperty({description: 'Número de placa del vehículo (6-10 caracteres alfanuméricos)', example: 'ABC123', pattern: '^[A-Z0-9]{6,10}$',})
    plate_number: string;

    @ApiProperty({description: 'Tipo de vehículo', enum: VehicleType, example: VehicleType.CAR,})
    @IsEnum(VehicleType)
    vehicle_type: VehicleType;

    @ApiProperty({description: 'Indica si el ticket fue creado por un operador desde el panel', required: false, example: false,})
    @IsOptional()
    @IsBoolean()
    isOperatorEntry?: boolean;
}
