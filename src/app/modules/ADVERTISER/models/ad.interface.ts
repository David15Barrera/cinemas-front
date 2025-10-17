export interface Ad{
    id: string;
    advertiserId: string;
    adType: AdsTargetType;
    content: string;
    imageUrl: string;
    videoUrl: string;
    startDate: Date;
    endDate: Date;
}

export enum AdsTargetType {
  TEXT = 'TEXT',
  TEXT_IMAGE = 'TEXT_IMAGE',
  VIDEO = 'VIDEO',
}