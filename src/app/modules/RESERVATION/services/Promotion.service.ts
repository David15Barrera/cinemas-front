import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '@shared/services/api-config.service';
import { Observable } from 'rxjs';
import { Promotion } from '../models/promotion.interface';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  private readonly apiConfigService = inject(ApiConfigService);
  private readonly _http = inject(HttpClient);
  private readonly API_PROMOTION = this.apiConfigService.API_PROMOTION;

  constructor() {}

  getReservationById(id: string): Observable<Promotion> {
    return this._http.get<Promotion>(`${this.API_PROMOTION}/${id}`);
  }

  getAllPromotionsByRoomId(roomId: String): Observable<Promotion[]> {
    return this._http.get<Promotion[]>(`${this.API_PROMOTION}/rooms/${roomId}`);
  }

  getAllPromotionsByCustomerId(customerId: String): Observable<Promotion[]> {
    return this._http.get<Promotion[]>(
      `${this.API_PROMOTION}/customers/${customerId}`
    );
  }

  getAllPromotionsByDishesId(dishesId: String): Observable<Promotion[]> {
    return this._http.get<Promotion[]>(
      `${this.API_PROMOTION}/dishes/${dishesId}`
    );
  }
}
