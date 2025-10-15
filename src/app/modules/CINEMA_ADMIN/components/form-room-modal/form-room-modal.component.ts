import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { CinemaService } from '../../services/cinema.service';
import { RoomService } from '../../services/Room.service';
import { Session } from 'app/modules/session/models/auth';
import { CreateRoom } from '../../models/room.interface';
import { AlertStore } from 'app/store/alert.store';
import { UploadImgService } from '../../services/uploadImg.service';
import { HandlerError } from '@shared/utils/handlerError';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImagePipe } from '@shared/pipes/image.pipe';
import { ImagePlus, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-form-room-modal',
  imports: [FormsModule, CommonModule, ImagePipe, LucideAngularModule],
  templateUrl: './form-room-modal.component.html',
})
export class FormRoomModalComponent {
  readonly ImagePlus = ImagePlus;

  // evento para cerrar el modal
  @Output() close = new EventEmitter<void>();

  // injección de servicios
  private readonly roomService = inject(RoomService);
  private readonly cinemaService = inject(CinemaService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly alertStore = inject(AlertStore);
  private readonly uploadService = inject(UploadImgService);

  private HandlerError = HandlerError;

  file!: File;
  formData!: FormData;
  imageUrl: string | null = null;

  // datos
  session: Session = this.localStorageService.getState().session;
  newRoom = signal<CreateRoom>({
    name: '',
    cinemaId: '',
    columns: 0,
    rows: 0,
    description: '',
    imageUrl: '',
  });
  cinemaId = signal<string>('');

  ngOnInit(): void {
    this.loadCinema();
  }

  async saveRoom() {
    // validar que los campos no estén vacíos
    if (
      this.newRoom().name.trim() === '' ||
      this.newRoom().description === '' ||
      this.newRoom().cinemaId === '' ||
      this.newRoom().imageUrl === '' ||
      this.newRoom().columns <= 0 ||
      this.newRoom().rows <= 0
    ) {
      this.alertStore.addAlert({
        message: `Por favor, complete todos los campos correctamente.`,
        type: 'info',
      });
      return;
    }

    if (this.file) {
      await this.uplogadImag();
    }

    this.createRoom();
  }

  createRoom() {
    this.roomService.createRoom(this.newRoom()).subscribe({
      next: (room) => {
        this.newRoom.set({
          name: '',
          cinemaId: this.cinemaId(),
          columns: 0,
          rows: 0,
          description: '',
          imageUrl: '',
        });
        this.alertStore.addAlert({
          message: `Sala ${room.name} creada con éxito.`,
          type: 'success',
        });
        this.onClose();
      },
      error: (err) => {
        console.error('Error al crear la sala:', err);
        const msgDefault = `Error al crear la sala. Inténtelo de nuevo más tarde.`;
        this.HandlerError.handleError(err, this.alertStore, msgDefault);
      },
    });
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (
      inputElement != null &&
      inputElement.files != null &&
      inputElement.files.length > 0
    ) {
      this.file = inputElement.files[0];
      this.formData = new FormData();
      this.formData.append('file', this.file, this.file.name);
      this.newRoom().imageUrl =
        'https://placehold.co/400x200?text=Vista+previa';
    }
  }

  private async uplogadImag(): Promise<void> {
    if (this.formData) {
      try {
        const value = await this.uploadService
          .saveImg(this.formData)
          .toPromise();
        this.newRoom().imageUrl = value.image;
        this.imageUrl = value.image;
      } catch (err) {
        this.newRoom().imageUrl = '';
        throw new Error('Error en uplogadImag');
      }
    }
  }

  onClose() {
    this.close.emit();
  }

  loadCinema() {
    this.cinemaService.getCinemaByAdminUserId(this.session.id).subscribe({
      next: (cinema) => {
        if (cinema) {
          this.newRoom().cinemaId = cinema.id;
          this.cinemaId.set(cinema.id);
        }
      },
    });
  }
}
