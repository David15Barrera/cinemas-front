export interface ChargePeriod{
    id: String;
    targetType: 'TEXT' | 'TEXT_IMAGE' | 'VIDEO';
    durationDays: number;
    cost: number;
}