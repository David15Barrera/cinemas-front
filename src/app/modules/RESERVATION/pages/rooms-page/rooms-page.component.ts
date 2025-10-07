import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlsUtils } from '@shared/utils/urls';
import { Room } from 'app/modules/RESERVATION/models/room.interface';
import { HotelService } from 'app/modules/RESERVATION/services/hotel.service';
import { ModalReservationComponent } from '../../components/modal-reservation/modal-reservation.component';

@Component({
  selector: 'app-rooms-page',
  imports: [NgClass, ModalReservationComponent],
  templateUrl: './rooms-page.component.html',
})
export class RoomsPageComponent {
  // modals
  @ViewChild('modalReservation')
  modalReservation!: ElementRef<HTMLDialogElement>;

  // inyectar el servicios
  private readonly route = inject(ActivatedRoute);
  private readonly hotelService = inject(HotelService);
  private readonly router = inject(Router);

  // utils
  urlsUtils = UrlsUtils;
  pinionId!: string;
  disposibles: boolean = false;

  rooms = signal<Room[]>([]);
  room = signal<Room | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.pinionId = params.get('id')!;
      this.getAllRoomsByHotelId(this.pinionId);
    });
  }

  getAllRoomsByHotelId(hotelId: string) {
    this.hotelService.getAllRoomsByHotelId(hotelId).subscribe({
      next: (rooms) => {
        this.rooms.set(rooms);
        this.addImageRandomHotel();
      },
      error: (error) => {
        console.error('Error fetching rooms:', error);
      },
    });
  }

  addImageRandomHotel() {
    this.rooms.update((currentHotels) =>
      currentHotels.map((hotel) => ({
        ...hotel,
        urlImage: this.urlsUtils.getRandomUrlRoom(),
      }))
    );
  }

  get roomsAux(): Room[] {
    return this.disposibles
      ? this.rooms().filter((room) => room.state === 'disponible')
      : this.rooms();
  }

  clickGoOpinionsRoom(roomId: string) {
    this.router.navigate(['reviews/opinions/room', roomId]);
  }

  closeModalReservation() {
    this.modalReservation.nativeElement.close();
  }

  openModalReservation(room: Room) {
    this.room.set(room);
    this.modalReservation.nativeElement.showModal();
  }
}
