import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import {
  Armchair,
  Edit,
  Plus,
  Eye,
  LucideAngularModule,
  Columns,
  Rows,
  MessageSquare,
} from 'lucide-angular';
import { FormRoomModalComponent } from '../../components/form-room-modal/form-room-modal.component';
import { Room } from '../../models/room.interface';
import { RoomService } from '../../services/Room.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Session } from 'app/modules/session/models/auth';
import { CinemaService } from '../../services/cinema.service';
import { NgClass } from '@angular/common';
import { SeatsModalComponent } from '../../components/seats-modal/seats-modal.component';
import { ImagePipe } from '@shared/pipes/image.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rooms-page',
  imports: [
    LucideAngularModule,
    FormRoomModalComponent,
    NgClass,
    SeatsModalComponent,
    ImagePipe,
  ],
  templateUrl: './rooms-page.component.html',
})
export class RoomsPageComponent {
  // iconos
  readonly Armchair = Armchair;
  readonly Edit = Edit;
  readonly Plus = Plus;
  readonly Eye = Eye;
  readonly Rows = Rows;
  readonly Columns = Columns;
  readonly MessageSquare = MessageSquare;

  // modal
  @ViewChild('modalFormRoom')
  modalFromRoom!: ElementRef<HTMLDialogElement>;
  @ViewChild('modalSeats')
  modalSeats!: ElementRef<HTMLDialogElement>;

  // injección de servicios
  private readonly roomService = inject(RoomService);
  private readonly cinemaService = inject(CinemaService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly router = inject(Router);

  // datos
  rooms = signal<Room[]>([]);
  roomUpdate = signal<Room | null>(null);
  session: Session = this.localStorageService.getState().session;

  ngOnInit(): void {
    this.loadCinema();
  }

  eventOnSaveSucces() {
    this.loadCinema();
  }

  getRoomsByCinemaId(cinemaId: string) {
    this.roomService.getRoomsByCinemaId(cinemaId).subscribe({
      next: (rooms) => {
        this.rooms.set(rooms);
      },
      error: (err) => {
        this.rooms.set([]);
        console.error('Error al obtener el cine:', err);
      },
    });
  }

  openModalFormRoom(roomUpdate: Room | null = null) {
    this.roomUpdate.set(roomUpdate);
    this.modalFromRoom.nativeElement.showModal();
  }

  closeModalFormRoom() {
    this.roomUpdate.set(null);
    this.modalFromRoom.nativeElement.close();
  }

  openModalSeats(room: Room) {
    this.roomUpdate.set(room);
    this.modalSeats.nativeElement.showModal();
  }

  closeModalSeat() {
    this.modalSeats.nativeElement.close();
  }

  loadCinema() {
    this.cinemaService.getCinemaByAdminUserId(this.session.id).subscribe({
      next: (cinema) => {
        if (cinema) this.getRoomsByCinemaId(cinema.id);
      },
    });
  }

  navigateReviews(room: Room) {
    this.router.navigate(['cinema/reviews', 'room', room.id]);
  }
}
