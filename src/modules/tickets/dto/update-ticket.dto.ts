import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { TicketStatus } from '../../../interfaces/enums';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
    @IsOptional()
    @IsEnum(TicketStatus)
    @ApiProperty({
        description: 'Estado del ticket',
        enum: TicketStatus,
        required: false,
        example: TicketStatus.PAID
    })
    status?: TicketStatus;
}
