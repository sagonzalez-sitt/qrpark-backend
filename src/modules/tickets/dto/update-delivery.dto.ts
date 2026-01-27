import {IsEnum} from 'class-validator';
import {TicketDeliveryMethod} from '../../../interfaces/enums';
import {ApiProperty} from '@nestjs/swagger';

export class UpdateDeliveryDto
{
    @IsEnum(TicketDeliveryMethod)
    @ApiProperty({
        description: 'Método de entrega del ticket',
        enum: TicketDeliveryMethod,
        example: TicketDeliveryMethod.DIGITAL_PHOTO,
        examples: {
            photo: {value: 'DIGITAL_PHOTO', description: 'Usuario tomó foto del QR en pantalla'},
            download: {value: 'DIGITAL_DOWNLOAD', description: 'Usuario escaneó y descargó el ticket'},
            printed: {value: 'PRINTED', description: 'Ticket impreso físicamente'},
            unknown: {value: 'UNKNOWN', description: 'Método no determinado'}
        }
    })
    delivery_method: TicketDeliveryMethod;
}
