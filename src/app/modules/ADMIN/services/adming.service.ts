import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '@shared/services/api-config.service';
import { BehaviorSubject, catchError, map, Observable, of, tap, take } from 'rxjs';
import { User } from '../models/user.interface';
import { Role } from '../models/role.interface';

@Injectable({
  providedIn: 'root',
})

export class AdmingService{
  private readonly _http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);

  private readonly API_USERS = `${this.apiConfig.API_USER}`;
  private readonly API_ROLES = this.apiConfig.API_ROLES;

  // Obtener todos los usuarios
  getUsers(): Observable<User[]> {
    return this._http.get<User[]>(this.API_USERS);
  }

  // Obtener usuario por ID
  getUserById(id: string): Observable<User> {
    return this._http.get<User>(`${this.API_USERS}/${id}`);
  }

  // Crear usuario
  createUser(user: User): Observable<User> {
    return this._http.post<User>(this.API_USERS, user);
  }

  // Actualizar usuario
  updateUser(id: string, user: User): Observable<User> {
    return this._http.put<User>(`${this.API_USERS}/${id}`, user);
  }

  // Eliminar usuario
  deleteUser(id: string): Observable<void> {
    return this._http.delete<void>(`${this.API_USERS}/${id}`);
  }

  // Obtener roles
  getRoles(): Observable<Role[]> {
    return this._http.get<Role[]>(this.API_ROLES);
  }
}