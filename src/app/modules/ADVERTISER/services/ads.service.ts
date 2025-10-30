import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '@shared/services/api-config.service';
import { Ad, AdsStatus, AdsTargetType } from '../models/ad.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdsService {

  private readonly _http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly API_ADS = this.apiConfig.API_ADS;



  constructor() { }

  public createAd(ad:Ad): Observable<Ad> {
    return this._http.post<Ad>(this.API_ADS, ad);
  }

  public getMyAds(advertiserId: string): Observable<Ad[]> {
    return this._http.get<any[]>(`${this.API_ADS}/advertiser/${advertiserId}`).pipe(
      map(ads => ads.map(ad => ({
        id: ad.id,
        advertiserId: ad.advertisementId,
        targetType: ad.adType as AdsTargetType,
        adStatus: ad.status as AdsStatus,
        content: ad.content || '',
        imageUrl: ad.imageUrl || '',
        videoUrl: ad.videoUrl || '',
        totalCost: ad.totalCost,
        startDate: ad.startDate ? new Date(ad.startDate) : undefined,
        endDate: ad.endDate ? new Date(ad.endDate) : undefined
      })))
    );
  }

  expiredAd(id: string): Observable<Ad> {
    return this._http.put<Ad>(`${this.API_ADS}/expired/${id}`, null);
  }
}
