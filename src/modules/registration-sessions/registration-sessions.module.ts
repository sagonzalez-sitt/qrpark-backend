import { Module } from '@nestjs/common';
import { RegistrationSessionsService } from './registration-sessions.service';
import { RegistrationSessionsController } from './registration-sessions.controller';
import { TicketsModule } from '../tickets/tickets.module';
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule, TicketsModule],
  controllers: [RegistrationSessionsController],
  providers: [RegistrationSessionsService],
  exports: [RegistrationSessionsService],
})
export class RegistrationSessionsModule {}
