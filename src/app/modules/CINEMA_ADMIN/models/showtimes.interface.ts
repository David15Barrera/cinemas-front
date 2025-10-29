import { Movie } from './movie.interface';

export interface CreateShowtime {
  movieId: string;
  roomId: string;
  startDate: string;
  startTime: string;
  price: number;
}

export interface ShowTime {
  id: string;
  roomId: string;
  price: number;
  movieId: string;
  startTime: string;
  endTime: string;
  active: boolean;
  durationMinutes: number;
  nameRoom: string;
  movie?: Movie;
}

