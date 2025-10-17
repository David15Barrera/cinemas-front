import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '@shared/services/api-config.service';
import { BehaviorSubject, catchError, Observable, of, take, tap } from 'rxjs';
import { Client } from '../models/client.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

private readonly _http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly API_CLIENT = this.apiConfig.API_AUTH;
  private readonly API_GLOBAL_CONFIGS = this.apiConfig.API_GLOBAL_CONFIGS;

  private clientSubject = new BehaviorSubject<Client | null>(null);

  constructor() {
    const cached = localStorage.getItem('cinema-client-store');
    if (cached) this.clientSubject.next(JSON.parse(cached));
  }

  public getClientByUserId(userId: string): Observable<Client | null> {
    if (this.clientSubject.value) {
      return of(this.clientSubject.value);
    }

    return this._http
      .get<Client>(`${this.API_CLIENT}/client/${userId}`)
      .pipe(
        tap((client: Client) => {
          localStorage.setItem('client', JSON.stringify(client));
          this.clientSubject.next(client);
        }),
        catchError(() => {
          // en caso de error backend
          localStorage.removeItem('client');
          this.clientSubject.next(null);
          return of(null);
        }),
        take(1)
      );
  }

  public clearCinema() {
    localStorage.removeItem('cinema-client-store');
    this.clientSubject.next(null);
  }
}
