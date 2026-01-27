import {TicketDeliveryMethod, TicketStatus, VehicleType} from "./enums";
import {IsEnum, IsOptional, IsString} from "class-validator";

export class TicketFilters {
    @IsOptional()
    @IsString()
    plate_number?: string;

    @IsOptional()
    @IsEnum(TicketStatus)
    status?: TicketStatus;

    @IsOptional()
    @IsEnum(VehicleType)
    vehicle_type?: VehicleType;

    @IsOptional()
    @IsEnum(TicketDeliveryMethod)
    delivery_method?: TicketDeliveryMethod;
}