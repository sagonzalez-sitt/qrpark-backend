import {Module} from '@nestjs/common';
import {QrService} from './qr.service';
import {QrController} from './qr.controller';
import {TicketsModule} from "../tickets/tickets.module";

@Module({
    imports: [TicketsModule],
    controllers: [QrController],
    providers: [QrService],
    exports: [QrService]
})
export class QrModule {}