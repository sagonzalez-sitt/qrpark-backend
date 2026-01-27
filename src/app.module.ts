import {Module} from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { QrModule } from './modules/qr/qr.module';
import { RegistrationSessionsModule } from './modules/registration-sessions/registration-sessions.module';

@Module({
    imports: [PrismaModule, PricingModule, TicketsModule, StatisticsModule, QrModule, RegistrationSessionsModule],
    controllers: [],
    providers: [],
})
export class AppModule {}