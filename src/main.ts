import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger, ValidationPipe} from "@nestjs/common";
import {environmentVariables} from "./config";
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

async function bootstrap() {
    const logger = new Logger('ParkQR Backend');

    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    app.enableCors({
        origin: true,
        credentials: true,
        /*
        origin: (origin, callback) => {
            const allowedOrigins = [
                'http://localhost:3000',
                environmentVariables.FRONTEND_URL
            ].filter(Boolean);

            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept, Authorization',
        */
    });

    const config = new DocumentBuilder()
        .setTitle('QRPark API')
        .setDescription('Sistema de gestión de parqueadero con códigos QR - API Documentation')
        .setVersion('1.0')
        .addTag('pricing', 'Gestión de tarifas por tipo de vehículo')
        .addTag('tickets', 'Gestión de tickets de entrada/salida')
        .addTag('statistics', 'Estadísticas y métricas del parqueadero')
        .addTag('qr', 'Generación de códigos QR')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
        customSiteTitle: 'QRPark API Docs',
        swaggerOptions: {
            filter: true,
            docExpansion: 'none',
            persistAuthorization: true,
        }
    });

    await app.listen(environmentVariables.PORT);

    logger.log(`Application is running on port: ${environmentVariables.PORT}`);
}

bootstrap();
