import {Module} from '@nestjs/common';
import {TicketsService} from './tickets.service';
import {TicketsController} from './tickets.controller';
import {PrismaModule} from "../../prisma/prisma.module";
import {PricingModule} from "../pricing/pricing.module";

@Module({
    imports: [PrismaModule, PricingModule],
    controllers: [TicketsController],
    providers: [TicketsService],
    exports: [TicketsService],
})
export class TicketsModule {}