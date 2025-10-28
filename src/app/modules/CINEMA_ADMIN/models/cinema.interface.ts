export interface Cinema {
  id: string;
  name: string;
  imageUrl: string;
  address: string;
  adminUserId: string;
  dailyCost: number;
  createdAt?: Date;
}

export interface CostGlobal {
  cost: number;
  id: string;
}
