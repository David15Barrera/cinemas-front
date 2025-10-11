import { Injectable } from "@angular/core";
import { environment } from "@environment/environment";

@Injectable({
    providedIn: 'root'
})
export class ApiConfigService {

    private readonly API_BASE = environment.API_ROOT;
    private readonly API_BASE_AUTH = `${this.API_BASE}/auth-identity/v1`;
    private readonly API_BASE_PROMOTION = `${this.API_BASE}/promotion/v1`;

    
    // auth
    public readonly API_AUTH = `${this.API_BASE_AUTH}/auth`;
    public readonly API_ROLES = `${this.API_BASE_AUTH}/roles`;
    
    //ENPOINTS

    // cines

    // Anuncios

    // promotions
    public readonly API_PROMOTION = `${this.API_BASE_PROMOTION}/promotions`
    
}