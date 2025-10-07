import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '@shared/services/api-config.service';
import { Observable } from 'rxjs';
import { Hotel } from '../models/hotel.interface';
import { Room } from '../models/room.interface';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private readonly apiConfigService = inject(ApiConfigService);
  private readonly _http = inject(HttpClient);
  private readonly API_HOTEL = this.apiConfigService.API_HOTEL;
  private readonly API_HOTEL_ROOMS = this.apiConfigService.API_HOTEL_ROOMS;

  constructor() {}

  getAllHotels(): Observable<Hotel[]> {
    return this._http.get<Hotel[]>(`${this.API_HOTEL}`);
  }

  getHotelById(id: string): Observable<Hotel> {
    return this._http.get<Hotel>(`${this.API_HOTEL}/${id}`);
  }

  getAllRoomsByHotelId(hotelId: string): Observable<Room[]> {
    return this._http.get<Room[]>(`${this.API_HOTEL_ROOMS}/hotel/${hotelId}`);
  }

  getRoomById(roomId: string): Observable<Room> {
    return this._http.get<Room>(`${this.API_HOTEL_ROOMS}/${roomId}`);
  }

  getAllRooms(): Observable<Room[]> {
    return this._http.get<Room[]>(`${this.API_HOTEL_ROOMS}`);
  }


}
