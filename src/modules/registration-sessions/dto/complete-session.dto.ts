import { IsEnum, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { VehicleType } from '../../../../generated/prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteSessionDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 10)
  @Matches(/^[A-Z0-9]+$/, {
    message: 'Plate number must contain only uppercase letters and numbers',
  })
  @ApiProperty({
    description: 'Número de placa del vehículo',
    example: 'ABC123',
    minLength: 6,
    maxLength: 10,
  })
  plate_number: string;

  @IsEnum(VehicleType)
  @ApiProperty({
    description: 'Tipo de vehículo',
    enum: VehicleType,
    example: VehicleType.CAR,
  })
  vehicle_type: VehicleType;
}
