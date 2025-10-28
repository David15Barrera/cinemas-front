import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '@shared/services/api-config.service';
import { BehaviorSubject, catchError, Observable, of, take, tap } from 'rxjs';
import { Advertiser } from '../models/advertiser.interface';

@Injectable({
  providedIn: 'root'
})
export class AdvertiserService {
  private readonly _http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly API_ADVERTISER = this.apiConfig.API_AUTH;
  private readonly API_GLOBAL_CONFIGS = this.apiConfig.API_GLOBAL_CONFIGS;

  private advertiserSubject = new BehaviorSubject<Advertiser | null>(null);

  constructor() { 
    const cached = localStorage.getItem('cinema-client-store');
    if(cached) this.advertiserSubject.next(JSON.parse(cached));
  }

public getAdvertiserByUserId(userId: string): Observable<Advertiser | null> {
    if (this.advertiserSubject.value) {
      return of(this.advertiserSubject.value);
    }

    return this._http
      .get<Advertiser>(`${this.API_ADVERTISER}/advertiser/${userId}`)
      .pipe(
        tap((advertiser: Advertiser) => {
          localStorage.setItem('advertiser', JSON.stringify(advertiser));
          this.advertiserSubject.next(advertiser);
        }),
        catchError(() => {
          // en caso de error backend
          localStorage.removeItem('advertiser');
          this.advertiserSubject.next(null);
          return of(null);
        }),
        take(1)
      );
  }

  public clearCinema() {
    localStorage.removeItem('cinema-client-store');
    this.advertiserSubject
    .next(null);
  }
}
