export interface CreateShowtime {
  movieId: string;
  roomId: string;
  startDate: string;
  startTime: string;
  price: number;
}

// TODO: validar que campos faltantes
export interface ShowTime {
  id: string;
  movieId: string;
  roomId: string;
  startDate: string;
  startTime: string;
  price: number;
  isActive: boolean;
}