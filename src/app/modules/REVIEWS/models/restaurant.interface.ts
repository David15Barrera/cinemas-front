export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  capacity: number;
  openingTime: string;
  closingTime: string;
  hotelId: string;
  imageUrl: string;
}

export interface Dishes {
  id: string;
  name: string;
  description: string;
  price: number;
  urlImage: string;
}
