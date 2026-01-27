import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RegistrationSessionsService } from './registration-sessions.service';
import { CompleteSessionDto } from './dto/complete-session.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('registration-sessions')
@Controller('registration-sessions')
export class RegistrationSessionsController {
  constructor(
    private readonly registrationSessionsService: RegistrationSessionsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nueva sesión de registro',
    description:
      'Genera un token de sesión único que se usa en el QR del torniquete',
  })
  @ApiResponse({
    status: 201,
    description: 'Sesión creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid' },
        session_token: {
          type: 'string',
          example: 'a1b2c3d4e5f6789012345678901234567890',
        },
        status: { type: 'string', example: 'PENDING' },
        expires_at: { type: 'string', example: '2024-01-01T12:00:00Z' },
      },
    },
  })
  async create() {
    return await this.registrationSessionsService.create();
  }

  @Get(':sessionToken')
  @ApiOperation({
    summary: 'Obtener información de una sesión',
    description: 'Verifica el estado de una sesión de registro',
  })
  @ApiParam({
    name: 'sessionToken',
    description: 'Token de sesión (32 caracteres hex)',
  })
  @ApiResponse({ status: 200, description: 'Sesión encontrada' })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
  async findOne(@Param('sessionToken') sessionToken: string) {
    return await this.registrationSessionsService.findOne(sessionToken);
  }

  @Post(':sessionToken/complete')
  @ApiOperation({
    summary: 'Completar sesión de registro',
    description:
      'Crea el ticket asociando placa y tipo de vehículo a la sesión',
  })
  @ApiParam({
    name: 'sessionToken',
    description: 'Token de sesión a completar',
  })
  @ApiResponse({
    status: 200,
    description: 'Sesión completada y ticket creado',
  })
  @ApiResponse({
    status: 400,
    description: 'Sesión ya completada o expirada',
  })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
  async complete(
    @Param('sessionToken') sessionToken: string,
    @Body() completeSessionDto: CompleteSessionDto,
  ) {
    return await this.registrationSessionsService.complete(
      sessionToken,
      completeSessionDto,
    );
  }
}
