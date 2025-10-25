import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from './api-config.service';
import { Observable } from 'rxjs';
import { Customer } from '@shared/models/customer.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly _http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly API_USERS = this.apiConfig.API_USERS;

  constructor() { }

  getAllCustomers():Observable<Customer[]> {
    return this._http.get<Customer[]>(`${this.API_USERS}/customers`);
  }

}
