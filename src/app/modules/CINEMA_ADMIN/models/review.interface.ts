export interface Review {
  id: string;
  userId: string;
  targetId: string;
  targetType: string;
  title: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

export interface TargetTypeReview {
  id: string;
  name: string;
  imageUrl: string;
  targetType: string;
  reviews: Review[];
}
