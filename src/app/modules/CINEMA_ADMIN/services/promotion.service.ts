import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '@shared/services/api-config.service';
import { NewPromotion, Promotion } from '../models/promotion.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  // inyecciones
  private readonly _http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly API_PROMOTIONS = this.apiConfig.API_PROMOTIONS;

  constructor() {}

  createPromotion(promotionData: NewPromotion): Observable<void> {
    return this._http.post<void>(`${this.API_PROMOTIONS}`, promotionData);
  }

  getPromotionsByCinemaId(cinemaId: string): Observable<Promotion[]> {
    return this._http.get<Promotion[]>(`${this.API_PROMOTIONS}/cinema/${cinemaId}`);
  }

  updatePromotion(promotionId: string, promotionData: Partial<Promotion>): Observable<void> {
    return this._http.put<void>(`${this.API_PROMOTIONS}/${promotionId}`, promotionData);
  }

  deletePromotion(promotionId: string): Observable<void> {
    return this._http.delete<void>(`${this.API_PROMOTIONS}/${promotionId}`);
  }
}
