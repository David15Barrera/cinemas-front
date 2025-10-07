export interface NewReview {
    customerId: string;
    refenceId: string;
    rating: number;
    comment: string;
    typeReference: 'hotel' | 'restaurant' | 'dishes' | 'room';
}

export interface Review {
    id: string;
    customerId: string;
    customerName: string;
    rating: number;
    comment: string;
    createdAt: Date;
}