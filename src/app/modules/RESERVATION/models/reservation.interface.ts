export interface Reservation {
  id: string;
  customerId: string;
  startDate: string;
  endDate: string;
  state: string;
  pricePerDay: number;
  totalPrice: number;
  maintenanceCostPerDay: number;
  totalCost: number;
  discountPercentage: number;
  roomId: string;
}

export type ReservationView = Reservation & {
  roomNumber: string;
  hotelName: string;
};

export interface NewReservation {
  startDate: string;
  endDate: string;
  customerId: string;
  roomId: string;
}
