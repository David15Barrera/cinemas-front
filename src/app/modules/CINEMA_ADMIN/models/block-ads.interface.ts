export interface BlockAd {
  id: string;
  cinemaId: string;
  adStatus: 'PENDING_PAYMENT' | 'ACTIVE' | 'REJECTED' | 'EXPIRED';
  durationDays: number;
  startDate: string;
  endDate: string;
  pricePaid: number;
}

export interface NewBlockAd {
  cinemaId: string;
  walletId: string;
  startDate: string;
  endDate: string;
}
