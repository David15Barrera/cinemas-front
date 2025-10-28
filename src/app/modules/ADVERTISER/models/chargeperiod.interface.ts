import { AdsTargetType } from "./ad.interface";

export interface ChargePeriod {
    id: string;
    adType: AdsTargetType;
    durationDays: number;
    cost: number;
}