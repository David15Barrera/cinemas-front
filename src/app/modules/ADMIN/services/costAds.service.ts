import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { ApiConfigService } from '@shared/services/api-config.service';
import { Observable } from 'rxjs';
import { ChargePeriod } from '../models/adsCost.interface';

@Injectable({
  providedIn: 'root',
})

export class costadsService{
  private readonly _http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly API_CHARPE = this.apiConfig.API_CHARPE;

  constructor() {}

  getchargePeriodbyid(id: String): Observable<ChargePeriod>{
    return this._http.get<ChargePeriod>(`${this.API_CHARPE}/${id}`);
  }
  
  updateChargePeriod(id: string, chargePeriod: ChargePeriod): Observable<ChargePeriod>{
    return this._http.put<ChargePeriod>(`${this.API_CHARPE}/${id}`, chargePeriod);
  }

  getChargePerText(): Observable<ChargePeriod>{
    return this._http.get<ChargePeriod>(`${this.API_CHARPE}/text`);
  }

  getChargePerVideo(): Observable<ChargePeriod>{
    return this._http.get<ChargePeriod>(`${this.API_CHARPE}/video`);
  }

  getChargePerTextVideo(): Observable<ChargePeriod>{
    return this._http.get<ChargePeriod>(`${this.API_CHARPE}/text-image`);
  }
}