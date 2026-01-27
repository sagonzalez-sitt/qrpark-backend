import {Decimal} from "@prisma/client/runtime/index-browser";
import {parking_tickets, TicketDeliveryMethod, TicketStatus, VehicleType} from "../../../../generated/prisma/client";

export class TicketEntity implements parking_tickets
{
    id: string;
    qr_token: string;
    plate_number: string;
    vehicle_type: VehicleType;
    entry_timestamp: Date;
    exit_timestamp: Date | null;
    calculated_fee: Decimal | null;
    status: TicketStatus;
    delivery_method: TicketDeliveryMethod;
    delivered: boolean;
    qr_downloaded_at: Date | null;
    printed_at: Date | null;
    created_at: Date;
    updated_at: Date;
}
