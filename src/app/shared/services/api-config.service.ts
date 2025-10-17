import { Injectable } from "@angular/core";
import { environment } from "@environment/environment";

@Injectable({
    providedIn: 'root'
})
export class ApiConfigService {

    private readonly API_BASE = environment.API_ROOT;
    private readonly API_BASE_AUTH = `${this.API_BASE}/auth-identity/v1`;
    private readonly API_BASE_PROMOTION = `${this.API_BASE}/promotion/v1`;
    public readonly API_IMAGES = `${this.API_BASE}/images/v1`
    private readonly API_CINEMA_SERVICE = `${this.API_BASE}/cinema/v1`;
    private readonly API_FINANCE_SERVICE = `${this.API_BASE}/wallet-payments/v1`;

    
    // auth
    public readonly API_AUTH = `${this.API_BASE_AUTH}/auth`;
    public readonly API_ROLES = `${this.API_BASE_AUTH}/roles`;
    
    //ENPOINTS

    // cines, rooms, seats
    public readonly API_CINEMA = `${this.API_CINEMA_SERVICE}/cinemas`;
    public readonly API_ROOMS = `${this.API_CINEMA_SERVICE}/rooms`;
    public readonly API_SEATS = `${this.API_CINEMA_SERVICE}/seats`;

    // Anuncios

    // promotions
    public readonly API_PROMOTION = `${this.API_BASE_PROMOTION}/promotions`

    // Upload
    public readonly API_UPLOAD = `${this.API_IMAGES}/images`

    // Finance
    public readonly API_GLOBAL_CONFIGS = `${this.API_FINANCE_SERVICE}/global-configs`
    
}