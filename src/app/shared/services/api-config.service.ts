import { Injectable } from "@angular/core";
import { environment } from "@environment/environment";

@Injectable({
    providedIn: 'root'
})
export class ApiConfigService {

    private readonly API_BASE = environment.API_ROOT;
    private readonly API_BASE_AUTH = `${this.API_BASE}/auth-identity/v1`;
    private readonly API_BASE_HOTEL = `${this.API_BASE}/hotel/v1`;
    private readonly API_BASE_REVIEWS = `${this.API_BASE}/reviews/v1`;
    private readonly API_BASE_RESTAURANT = `${this.API_BASE}/restaurant/v1`;
    private readonly API_BASE_PROMOTION = `${this.API_BASE}/promotion/v1`;

    
    
    public readonly API_AUTH = `${this.API_BASE_AUTH}/auth`;
    
    // Hotel endpoints
    public readonly API_HOTEL = `${this.API_BASE_HOTEL}/hotels`;
    public readonly API_HOTEL_ROOMS = `${this.API_BASE_HOTEL}/rooms`;
    public readonly API_HOTEL_RESERVATIONS = `${this.API_BASE_HOTEL}/reservations`;

    // reviews
    public readonly API_REVIEWS = `${this.API_BASE_REVIEWS}/reviews`;
    public readonly API_REVIEWS_HOTEL = `${this.API_REVIEWS}/hotel`;
    public readonly API_REVIEWS_RESTAURANT = `${this.API_REVIEWS}/restaurant`;
    public readonly API_REVIEWS_ROOM = `${this.API_REVIEWS}/room`;
    public readonly API_REVIEWS_DISHES = `${this.API_REVIEWS}/dishes`;

    // restaurant
    public readonly API_RESTAURANT = `${this.API_BASE_RESTAURANT}/restaurants`;
    public readonly API_RESTAURANT_DISHES = `${this.API_BASE_RESTAURANT}/dishes`;
    

    // RESERVATION
    public readonly API_RESERVATION = `${this.API_BASE_HOTEL}/reservations`

    // promotions
    public readonly API_PROMOTION = `${this.API_BASE_PROMOTION}/promotions`
    
}