import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '@shared/services/api-config.service';
import { Observable } from 'rxjs';
import { BlockAd, NewBlockAd } from '../models/block-ads.interface';
import { CostGlobal } from '../models/cinema.interface';

@Injectable({
  providedIn: 'root',
})
export class BlockAdsService {
  private readonly _http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly API_BLOCK_ADS = this.apiConfig.API_BLOCK_ADS;
  private readonly API_GLOBAL_CONFIGS = this.apiConfig.API_GLOBAL_CONFIGS;

  constructor() {}

  createAdBlock(newAdBlock: NewBlockAd): Observable<void> {
    return this._http.post<void>(this.API_BLOCK_ADS, newAdBlock);
  }

  getAdBlockActiveByCinemaId(cinemaId: string): Observable<BlockAd> {
    return this._http.get<BlockAd>(
      `${this.API_BLOCK_ADS}/top-active/cinema/${cinemaId}`
    );
  }

  getAllAdBlocksByCinemaId(cinemaId: string): Observable<BlockAd[]> {
    return this._http.get<BlockAd[]>(
      `${this.API_BLOCK_ADS}/cinema/${cinemaId}`
    );
  }

  updateStateById(blockAdId: string): Observable<void> {
    return this._http.put<void>(`${this.API_BLOCK_ADS}/state/${blockAdId}`, {
      state: 'ACTIVE',
      id: blockAdId,
    });
  }

  public getCostGlobal(): Observable<CostGlobal> {
    return this._http.get<CostGlobal>(
      `${this.API_GLOBAL_CONFIGS}/ads/cost-per-day`
    );
  }
}
