import {VehicleType} from "./enums";

export interface Pricing {
    id: number;
    vehicle_type: VehicleType;
    price_per_hour: number;
    active: boolean;
    created_at: Date;
    updated_at: Date;
}