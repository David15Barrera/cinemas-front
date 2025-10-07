import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '@shared/services/api-config.service';
import { Observable } from 'rxjs';
import { Dishes, Restaurant } from '../models/restaurant.interface';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private readonly apiConfigService = inject(ApiConfigService);
  private readonly _http = inject(HttpClient);
  private readonly API_RESTAURANT = this.apiConfigService.API_RESTAURANT;
  private readonly API_RESTAURANT_DISHES =
    this.apiConfigService.API_RESTAURANT_DISHES;

  constructor() {}

  getAllRestaurants(): Observable<Restaurant[]> {
    return this._http.get<Restaurant[]>(`${this.API_RESTAURANT}`);
  }

  getRestaurantById(id: string): Observable<Restaurant> {
    return this._http.get<Restaurant>(`${this.API_RESTAURANT}/${id}`);
  }

  getAllDishesByRestaurantId(restaurantId:string): Observable<Dishes[]> {
    return this._http.get<Dishes[]>(`${this.API_RESTAURANT_DISHES}/restaurant/${restaurantId}`);
  }

  getDishById(dishId: string): Observable<Dishes> {
    return this._http.get<Dishes>(`${this.API_RESTAURANT_DISHES}/${dishId}`);
  }
}
