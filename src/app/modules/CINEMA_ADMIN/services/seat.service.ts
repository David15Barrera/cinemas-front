import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '@shared/services/api-config.service';
import { Observable } from 'rxjs';
import { Seat } from '../models/seat.interface';

@Injectable({
  providedIn: 'root',
})
export class SeatService {
  private readonly _http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly API_SEATS = this.apiConfig.API_SEATS;

  constructor() {}

  public getSeatsByRoomId(roomId: string): Observable<Seat[]> {
    return this._http.get<Seat[]>(`${this.API_SEATS}/room/${roomId}`);
  }
}
