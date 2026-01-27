import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateQrDto {
    @ApiProperty({
        description: 'Contenido que se codificará en el código QR (URL o texto)',
        example: 'https://example.com/self-service',
    })
    @IsString()
    @IsNotEmpty()
    content: string;
}
