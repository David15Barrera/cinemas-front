import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { Armchair, Edit, Plus, Eye, LucideAngularModule } from 'lucide-angular';
import { FormRoomModalComponent } from '../../components/form-room-modal/form-room-modal.component';
import { Room } from '../../models/room.interface';
import { RoomService } from '../../services/Room.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Session } from 'app/modules/session/models/auth';
import { CinemaService } from '../../services/cinema.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-rooms-page',
  imports: [LucideAngularModule, FormRoomModalComponent, NgClass],
  templateUrl: './rooms-page.component.html',
})
export class RoomsPageComponent {
  // iconos
  readonly Armchair = Armchair;
  readonly Edit = Edit;
  readonly Plus = Plus;
  readonly Eye = Eye;

  // modal
  @ViewChild('modalFormRoom')
  modalFromRoom!: ElementRef<HTMLDialogElement>;

  // injección de servicios
  private readonly roomService = inject(RoomService);
  private readonly cinemaService = inject(CinemaService);
  private readonly localStorageService = inject(LocalStorageService);

  // datos
  rooms = signal<Room[]>([]);
  session: Session = this.localStorageService.getState().session;

  ngOnInit(): void {
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

  openModalFormRoom() {
    this.modalFromRoom.nativeElement.showModal();
  }

  closeModalFormRoom() {
    this.modalFromRoom.nativeElement.close();
  }

  loadCinema() {
    this.cinemaService.getCinemaByAdminUserId(this.session.id).subscribe({
      next: (cinema) => {
        if (cinema) this.getRoomsByCinemaId(cinema.id);
      },
    });
  }
}
