import {
  Component,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { Movie } from '../../models/movie.interface';
import { Room } from '../../models/room.interface';
import { FormsModule } from '@angular/forms';
import { CreateShowtime } from '../../models/showtimes.interface';
import { ImagePipe } from '@shared/pipes/image.pipe';
import { AlertStore } from 'app/store/alert.store';
import { Session } from 'app/modules/session/models/auth';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { HandlerError } from '@shared/utils/handlerError';
import { ShowtimesService } from '../../services/showtimes.service';

@Component({
  selector: 'app-form-showtimes-modal',
  imports: [FormsModule, ImagePipe],
  templateUrl: './form-showtimes-modal.component.html',
})
export class FormShowtimesModalComponent {
  // outputs
  @Output() close = new EventEmitter<void>();

  // injeccion de servicio
  private readonly alertStore = inject(AlertStore);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly showtimeService = inject(ShowtimesService);

  private HandlerError = HandlerError;
  session: Session = this.localStorageService.getState().session;

  // inputs
  movie = input<Movie | null>(null);
  rooms = input.required<Room[]>();

  // vars form
  idRoom = signal<string>('');
  createShowtime = signal<CreateShowtime>({
    movieId: this.movie()?.id || '',
    roomId: '',
    startDate: '',
    startTime: '',
    price: 0,
  });

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.initializeForm();
  }

  saveNewShowtime() {
    this.createShowtime().roomId = this.idRoom();
    // validacion de campos
    if (
      !this.createShowtime().roomId ||
      !this.createShowtime().movieId ||
      !this.createShowtime().startDate ||
      !this.createShowtime().startTime ||
      this.createShowtime().price <= 0
    ) {
      this.alertStore.addAlert({
        message: `Por favor, complete todos los campos correctamente.`,
        type: 'info',
      });
      return;
    }

    // Normalizar la fecha actual en formato yyyy-MM-dd
    const todayStr = this.getTodayStr();

    // Validar que fecha inicio sea >= fecha actual
    if (this.createShowtime().startDate < todayStr) {
      this.alertStore.addAlert({
        message: 'La fecha de inicio no puede ser menor a la fecha actual.',
        type: 'info',
      });
      return;
    }

    this.showtimeService.createShowtime(this.createShowtime()).subscribe({
      next: (response) => {
        this.alertStore.addAlert({
          message: 'Función creada correctamente.',
          type: 'success',
        });
        this.initializeForm();
        this.onClose();
      },
      error: (error) => {
        const msgDefault = `Error al crear la sala. Inténtelo de nuevo más tarde.`;
        this.HandlerError.handleError(error, this.alertStore, msgDefault);
      },
    });
  }

  onClose() {
    this.close.emit();
  }

  initializeForm() {
    this.createShowtime.set({
      movieId: this.movie()?.id || '',
      roomId: '',
      startDate: '',
      startTime: '',
      price: 0,
    });
    this.idRoom.set('');
  }

  getTodayStr(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
