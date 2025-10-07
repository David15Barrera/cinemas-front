import { Component, computed, inject, signal } from '@angular/core';
import { HotelService } from '../../services/hotel.service';
import { ReservationService } from '../../services/Reservation.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import {
  Reservation,
  ReservationView,
} from '../../models/reservation.interface';
import { Room } from '../../models/room.interface';
import { Session } from 'app/modules/session/models/auth';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-my-reservations-page',
  imports: [DatePipe, NgClass, CurrencyPipe],
  templateUrl: './my-reservations-page.component.html',
})
export class MyReservationsPageComponent {
  // injeccion de servicios
  private readonly hotelService = inject(HotelService);
  private readonly reservationService = inject(ReservationService);
  private readonly localStorageService = inject(LocalStorageService);

  // catalogos
  reservations = signal<Reservation[]>([]);
  rooms = signal<Room[]>([]);

  session: Session = this.localStorageService.getState().session;

  ngOnInit(): void {    
    forkJoin({
      reservations: this.reservationService.getReservationsByCustomerId(
        this.session.customerId
      ),
      rooms: this.hotelService.getAllRooms()
    }).subscribe(({ reservations, rooms }) => {      
      this.reservations.set(reservations);
      this.rooms.set(rooms);
    });
  }

  enrichedReservations = computed<ReservationView[]>(() => {
    if (this.reservations().length && this.rooms().length) {
      return this.mapReservationsWithDetails();
    }
    return [];
  });

  mapReservationsWithDetails(): ReservationView[] {
    const roomsMap = new Map(this.rooms().map((r) => [r.id, r]));

    return this.reservations().map((reservation) => {
      const room = roomsMap.get(reservation.roomId);

      return {
        ...reservation,
        roomNumber: room ? room.roomNumber : '',
        hotelName: room ? room.hotelName : '',
      };
    });
  }
}
