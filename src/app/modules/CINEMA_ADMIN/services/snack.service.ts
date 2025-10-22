import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '@shared/services/api-config.service';
import { NewSnack, Snack } from '../models/snack.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SnackService {
  private readonly _http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly API_SNACKS = this.apiConfig.API_SNACKS;

  constructor() {}

  getSnacks(): Observable<Snack[]> {
    return this._http.get<Snack[]>(this.API_SNACKS);
  }

  getSnacksByCinemaId(cinemaId: string): Observable<Snack[]> {
    return this._http.get<Snack[]>(`${this.API_SNACKS}?cinemaId=${cinemaId}`);
  }

  getSnackById(id: string): Observable<Snack> {
    return this._http.get<Snack>(`${this.API_SNACKS}/${id}`);
  }

  createSnack(snack: NewSnack): Observable<Snack> {
    return this._http.post<Snack>(this.API_SNACKS, snack);
  }

  updateSnack(id: string, snack: Snack): Observable<Snack> {
    return this._http.put<Snack>(`${this.API_SNACKS}/${id}`, snack);
  }
}
