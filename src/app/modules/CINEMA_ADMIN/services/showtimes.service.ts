import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '@shared/services/api-config.service';
import { CreateShowtime, ShowTime } from '../models/showtimes.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShowtimesService {
  private readonly _http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly API_SHOWTIMES = this.apiConfig.API_SHOWTIMES;

  constructor() {}

  createShowtime(createShowtime: CreateShowtime): Observable<void> {
    return this._http.post<void>(this.API_SHOWTIMES, createShowtime);
  }

  getShowTimesByCinemaId(cinemaId: string): Observable<ShowTime[]> {
    return this._http.get<ShowTime[]>(
      `${this.API_SHOWTIMES}/cinema/${cinemaId}`
    );
  }

  updateShowtimeStatus(
    showtimeId: string,
    active: boolean
  ): Observable<void> {
    return this._http.patch<void>(`${this.API_SHOWTIMES}/${showtimeId}`, {
      active,
    });
  }
}
