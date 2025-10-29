import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '@shared/services/api-config.service';
import { BehaviorSubject, catchError, map, Observable, of, tap, take } from 'rxjs';
import { Cinema, CostGlobal } from '../models/cinema.interface';

@Injectable({
  providedIn: 'root',
})
export class CinemaService {
  private readonly _http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly API_CINEMA = this.apiConfig.API_CINEMA;
  private readonly API_GLOBAL_CONFIGS = this.apiConfig.API_GLOBAL_CONFIGS;

  private cinemaSubject = new BehaviorSubject<Cinema | null>(null);

  constructor() {
    const cached = localStorage.getItem('cinema');
    if (cached) this.cinemaSubject.next(JSON.parse(cached));
  }

  public getCinemaByAdminUserId(adminUserId: string): Observable<Cinema | null> {
    if (this.cinemaSubject.value) {
      return of(this.cinemaSubject.value);
    }

    return this._http
      .get<Cinema>(`${this.API_CINEMA}/admin/${adminUserId}`)
      .pipe(
        tap((cinema: Cinema) => {
          localStorage.setItem('cinema', JSON.stringify(cinema));
          this.cinemaSubject.next(cinema);
        }),
        catchError(() => {
          // en caso de error backend
          localStorage.removeItem('cinema');
          this.cinemaSubject.next(null);
          return of(null);
        }),
        take(1)
      );
  }

  public updateCinema(cinema: Cinema): Observable<Cinema> {
    return this._http.put<Cinema>(`${this.API_CINEMA}/${cinema.id}`, cinema);
  }

  public getAllCinemas(): Observable<Array<Cinema>> {
    return this._http.get<Array<Cinema>>(`${this.API_CINEMA}`);
  }

  public createCinema(cinema: Cinema): Observable<Cinema> {
    return this._http.post<Cinema>(this.API_CINEMA, cinema);
  }

  public getCinemaById(id:string): Observable<Cinema[]>{
    return this._http.get<Cinema[]>(this.API_CINEMA)
  }

  public getCostGlobal(): Observable<CostGlobal>{
    return this._http.get<CostGlobal>(`${this.API_GLOBAL_CONFIGS}/cinema/cost-per-day`);
  }

  public clearCinema() {
    localStorage.removeItem('cinema');
    this.cinemaSubject.next(null);
  }
}
