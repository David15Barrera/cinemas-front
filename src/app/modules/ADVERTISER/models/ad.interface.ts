export interface Ad{
    id: string;
    advertiserId: string;
    targetType: AdsTargetType;
    adStatus: AdsStatus;
    content: string;
    imageUrl: string;
    videoUrl: string;
    startDate?: Date;
    endDate?: Date;
}

export enum AdsTargetType {
  TEXT = 'TEXT',
  TEXT_IMAGE = 'TEXT_IMAGE',
  VIDEO = 'VIDEO',
}
export enum AdsStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}