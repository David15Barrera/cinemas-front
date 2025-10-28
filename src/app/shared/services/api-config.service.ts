import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiConfigService {
  private readonly API_BASE = environment.API_ROOT;
  private readonly API_BASE_AUTH = `${this.API_BASE}/auth-identity/v1`;
  private readonly API_BASE_PROMOTION = `${this.API_BASE}/promotion/v1`;
  public readonly API_BASE_AD = `${this.API_BASE}/ads/v1`;
  public readonly API_IMAGES = `${this.API_BASE}/images/v1`;
  private readonly API_CINEMA_SERVICE = `${this.API_BASE}/cinema/v1`;
  private readonly API_MOVIE_SERVICE = `${this.API_BASE}/movie/v1`;
  private readonly API_FINANCE_SERVICE = `${this.API_BASE}/wallet-payments/v1`;
  private readonly API_SNACK_TICKETS_SERVICE = `${this.API_BASE}/snacks-tickets/v1`;
  private readonly API_REVIEWS_SERVICE = `${this.API_BASE}/reviews/v1`;
  private readonly API_PROMOTION_SERVICE = `${this.API_BASE}/promotion/v1`;

  // auth
  public readonly API_AUTH = `${this.API_BASE_AUTH}/auth`;
  public readonly API_ROLES = `${this.API_BASE_AUTH}/roles`;
  public readonly API_USERS = `${this.API_BASE_AUTH}/users`;

  // movies, categories, showtimes
  public readonly API_MOVIES = `${this.API_MOVIE_SERVICE}/movies`;
  public readonly API_CATEGORIES = `${this.API_MOVIE_SERVICE}/categories`;

  // cines, rooms, seats
  public readonly API_CINEMA = `${this.API_CINEMA_SERVICE}/cinemas`;
  public readonly API_ROOMS = `${this.API_CINEMA_SERVICE}/rooms`;
  public readonly API_SEATS = `${this.API_CINEMA_SERVICE}/seats`;
  public readonly API_SHOWTIMES = `${this.API_CINEMA_SERVICE}/show-times`;

  // Anuncios
  public readonly API_ADS = `${this.API_BASE_AD}/ads`;

  // promotions
  public readonly API_PROMOTION = `${this.API_BASE_PROMOTION}/promotions`;

  // Upload
  public readonly API_UPLOAD = `${this.API_IMAGES}/images`;

  // Finance
  public readonly API_GLOBAL_CONFIGS = `${this.API_FINANCE_SERVICE}/global-configs`;
  public readonly API_WALLET = `${this.API_FINANCE_SERVICE}/wallets`;
  public readonly API_TRANSACTIONS = `${this.API_FINANCE_SERVICE}/transactions`;

  // Snacks
  public readonly API_SNACKS = `${this.API_SNACK_TICKETS_SERVICE}/snacks`;

  // Reviews
  public readonly API_REVIEWS = `${this.API_REVIEWS_SERVICE}/reviews`;

  // promotions
  public readonly API_PROMOTIONS = `${this.API_PROMOTION_SERVICE}/promotions`;
}
