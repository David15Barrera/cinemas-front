import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiConfigService } from "@shared/services/api-config.service";
import { Observable } from "rxjs";
import { Confirmation, Login, Register, Session } from "../models/auth";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private http: HttpClient,
        private apiConfigService: ApiConfigService
    ) { }

    login(login: Login): Observable<Session> {
        return this.http.post<Session>(`${this.apiConfigService.API_AUTH}/sign-in`, login);
    }

    register(register: Register): Observable<Register> {
        return this.http.post<Register>(`${this.apiConfigService.API_AUTH}/sign-up`, register);
    }

    confirmation(confirmation: Confirmation): Observable<Session> {
        return this.http.put<Session>(`${this.apiConfigService.API_AUTH}/sign-up`, confirmation);
    }

}