import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '@shared/services/api-config.service';
import { BehaviorSubject, catchError, map, Observable, of, tap, take } from 'rxjs';
import { CostGlobalCinMed } from '../models/costglobal.interface';

@Injectable({
  providedIn: 'root',
})

export class globalCostService{
  private readonly _http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly API_GLOBAL_CONFIGS = this.apiConfig.API_GLOBAL_CONFIGS;

  createGlobalCost(costGlobal: CostGlobalCinMed): Observable<CostGlobalCinMed>{
    return this._http.post<CostGlobalCinMed>(this.API_GLOBAL_CONFIGS, costGlobal);
  }

  updateGlobalCost(id: string, costGlobal: CostGlobalCinMed): Observable<CostGlobalCinMed>{
    return this._http.put<CostGlobalCinMed>(`${this.API_GLOBAL_CONFIGS}/${id}`, costGlobal);
  }

  getGlobalCostCinemabyId(id: string): Observable<CostGlobalCinMed>{
    return this._http.get<CostGlobalCinMed>(`${this.API_GLOBAL_CONFIGS}/${id}`);
  }

  getGlobalCostCinema(): Observable<CostGlobalCinMed>{
    return this._http.get<CostGlobalCinMed>(`${this.API_GLOBAL_CONFIGS}/cinema/cost-per-day`);
  }

  getGlobalCostAds(): Observable<CostGlobalCinMed>{
    return this._http.get<CostGlobalCinMed>(`${this.API_GLOBAL_CONFIGS}/ads/cost-per-day`);
  }
}