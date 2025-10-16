import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '@shared/services/api-config.service';
import { CreateRoom, Room } from '../models/room.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private readonly _http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly API_ROOMS = this.apiConfig.API_ROOMS;

  constructor() {}

  createRoom(createRoom: CreateRoom): Observable<Room>{
    return this._http.post<Room>(`${this.API_ROOMS}`, createRoom);
  }

  updateRoom(roomId: string, updateRoom: Partial<Room>): Observable<Room> {
    return this._http.put<Room>(`${this.API_ROOMS}/${roomId}`, updateRoom);
  }

  getRoomsByCinemaId(cinemaId: string): Observable<Room[]> {
    return this._http.get<Room[]>(`${this.API_ROOMS}/cinema/${cinemaId}`);
  }

  getRoomById(roomId: string): Observable<Room> {
    return this._http.get<Room>(`${this.API_ROOMS}/${roomId}`);
  }
}
