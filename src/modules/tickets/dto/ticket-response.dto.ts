import { TicketEntity } from '../entities/ticket.entity';

export class TicketResponseDto extends TicketEntity {
  duration_ms?: number;
  duration_formatted?: string;
  fee_amount?: number;
}
