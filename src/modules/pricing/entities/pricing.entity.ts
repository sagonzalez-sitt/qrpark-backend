import {pricing_config, VehicleType} from "../../../../generated/prisma/client";
import {Decimal} from "@prisma/client/runtime/client";

export class PricingEntity implements pricing_config
{
    id: string;
    vehicle_type: VehicleType;
    price_per_hour: Decimal;
    active: boolean;
    created_at: Date;
    updated_at: Date;
}
