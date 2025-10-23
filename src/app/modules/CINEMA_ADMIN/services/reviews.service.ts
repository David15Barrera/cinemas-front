import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '@shared/services/api-config.service';
import { Review } from '../models/review.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private readonly _http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly API_REVIEWS = this.apiConfig.API_REVIEWS;

  constructor() {}

  getReviewsByTargetId(targetId: string): Observable<Review[]> {
    return this._http.get<Review[]>(`${this.API_REVIEWS}/target/${targetId}`);
  }

  deleteReviewById(reviewId: string): Observable<void> {
    return this._http.delete<void>(`${this.API_REVIEWS}/${reviewId}`);
  }
}
