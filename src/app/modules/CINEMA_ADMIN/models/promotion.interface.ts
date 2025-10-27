export interface Promotion {
    id: string;
    cinemaId: string;
    title: string;
    description: string;
    discountPercentage: number;
    targetId: string;
    targetType: 'ROOM' | 'MOVIE' | 'CLIENT';
    isActive: boolean;
    startDate: string;
    endDate: string;
}

export interface NewPromotion{
    cinemaId: string;
    title: string;
    description: string;
    discountPercentage: number;
    targetId: string;
    targetType: 'ROOM' | 'MOVIE' | 'CLIENT';
    startDate: string;
    endDate: string;
}