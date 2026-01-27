import {Controller, Get, Post, Body, Param, Res, BadRequestException} from '@nestjs/common';
import {QrService} from './qr.service';
import type {Response} from "express";
import {TicketsService} from "../tickets/tickets.service";
import {ApiTags, ApiOperation, ApiResponse, ApiParam, ApiProduces} from '@nestjs/swagger';
import {GenerateQrDto} from './dto/generate-qr.dto';

@ApiTags('qr')
@Controller('qr')
export class QrController
{
    constructor(private readonly qrService: QrService, private readonly ticketsService: TicketsService) {}

    @Post('generate')
    @ApiOperation({
        summary: 'Generar código QR genérico desde cualquier contenido',
        description: 'Genera un código QR a partir de cualquier texto o URL proporcionada. Útil para QR estático de autoservicio.'
    })
    @ApiResponse({
        status: 201,
        description: 'QR generado exitosamente',
        schema: {
            type: 'object',
            properties: {
                qrDataUrl: { type: 'string', example: 'data:image/png;base64,iVBORw0KGgo...' }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Contenido inválido' })
    async generateQr(@Body() generateQrDto: GenerateQrDto)
    {
        try
        {
            const qrDataUrl = await this.qrService.generateQrFromContent(generateQrDto.content);
            return { qrDataUrl };
        }
        catch (e)
        {
            throw new BadRequestException(`Failed to generate QR code: ${e}`);
        }
    }

    @Get(':token')
    @ApiOperation({
        summary: 'Generar código QR como imagen PNG',
        description: 'Retorna el código QR del ticket como archivo PNG descargable (500x500px)'
    })
    @ApiParam({ name: 'token', description: 'Token hexadecimal del ticket (32 caracteres)' })
    @ApiProduces('image/png')
    @ApiResponse({ status: 200, description: 'Imagen PNG del código QR' })
    @ApiResponse({ status: 400, description: 'Token inválido o ticket no encontrado' })
    async getQrImage(@Param('token') token: string, @Res() res: Response)
    {
        if (!this.qrService.isValidToken(token)) throw new BadRequestException('Invalid token');

        try
        {
            const ticket = await this.ticketsService.findByToken(token);

            if (!ticket) throw new BadRequestException('Ticket not found');

            const qrBuffer = await this.qrService.generateQrBuffer(token);
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Content-Disposition', `inline; filename="ticket_${ticket.id}_qr.png"`);
            res.send(qrBuffer);
        }
        catch (e)
        {
            throw new BadRequestException(`Failed to generate QR code: ${e}`);
        }
    }

    @Get(':token/dataurl')
    @ApiOperation({
        summary: 'Generar código QR como Data URL (base64)',
        description: 'Retorna el código QR como Data URL base64 para mostrar en navegador sin descarga'
    })
    @ApiParam({ name: 'token', description: 'Token hexadecimal del ticket' })
    @ApiResponse({
        status: 200,
        description: 'Data URL del QR generada exitosamente',
        schema: {
            type: 'object',
            properties: {
                token: { type: 'string', example: 'a1b2c3d4e5f6...' },
                qrDataUrl: { type: 'string', example: 'data:image/png;base64,iVBORw0KGgo...' }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Token inválido o ticket no encontrado' })
    async getQrDataUrl(@Param('token') token: string)
    {
        if (!this.qrService.isValidToken(token)) throw new BadRequestException('Invalid token');

        try
        {
            const ticket = await this.ticketsService.findByToken(token);

            if (!ticket) throw new BadRequestException('Ticket not found');

            const dataUrl = await this.qrService.generateQrDataUrl(token);

            return { token, qrDataUrl: dataUrl }
        }
        catch (e)
        {
            throw new BadRequestException(`Failed to generate QR code: ${e}`);
        }
    }

    @Get(':token/large')
    @ApiOperation({
        summary: 'Generar código QR gigante para pantalla de torniquete',
        description: 'Retorna QR de 800x800px como Data URL, incluye información del ticket'
    })
    @ApiParam({ name: 'token', description: 'Token hexadecimal del ticket' })
    @ApiResponse({
        status: 200,
        description: 'QR gigante generado exitosamente',
        schema: {
            type: 'object',
            properties: {
                token: { type: 'string' },
                ticket: { type: 'object', description: 'Información completa del ticket' },
                qrDataUrl: { type: 'string', example: 'data:image/png;base64,iVBORw0KGgo...' }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Token inválido o ticket no encontrado' })
    async getLargeQrDataUrl(@Param('token') token: string)
    {
        if (!this.qrService.isValidToken(token)) throw new BadRequestException('Invalid token');

        try
        {
            const ticket = await this.ticketsService.findByToken(token);

            if (!ticket) throw new BadRequestException('Ticket not found');

            const dataUrl = await this.qrService.generateLargeQrDataUrl(token);

            return { token, ticket, qrDataUrl: dataUrl }
        }
        catch (e)
        {
            throw new BadRequestException(`Failed to generate QR code: ${e}`);
        }
    }
}
