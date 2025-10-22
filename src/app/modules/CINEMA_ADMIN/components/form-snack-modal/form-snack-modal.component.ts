import {
  Component,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import {
  ImagePlus,
  LucideAngularModule,
  Popcorn,
  Package,
  FileText,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Calculator,
  Image,
  CheckCircle,
  X,
  Save,
} from 'lucide-angular';
import { NewSnack, Snack } from '../../models/snack.interface';
import { HandlerError } from '@shared/utils/handlerError';
import { Session } from 'app/modules/session/models/auth';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { AlertStore } from 'app/store/alert.store';
import { UploadImgService } from '../../services/uploadImg.service';
import { CinemaService } from '../../services/cinema.service';
import { SnackService } from '../../services/snack.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImagePipe } from '@shared/pipes/image.pipe';

@Component({
  selector: 'app-form-snack-modal',
  imports: [LucideAngularModule, FormsModule, CommonModule, ImagePipe],
  templateUrl: './form-snack-modal.component.html',
})
export class FormSnackModal {
  // Iconos de lucide-angular
  readonly ImagePlus = ImagePlus;
  readonly Popcorn = Popcorn;
  readonly Package = Package;
  readonly FileText = FileText;
  readonly TrendingDown = TrendingDown;
  readonly TrendingUp = TrendingUp;
  readonly DollarSign = DollarSign;
  readonly Calculator = Calculator;
  readonly Image = Image;
  readonly CheckCircle = CheckCircle;
  readonly X = X;
  readonly Save = Save;

  // evento para cerrar el modal
  @Output() close = new EventEmitter<void>();
  @Output() saveSucces = new EventEmitter<void>();

  // input para editar
  snackUpdate = input<Snack | null>(null);

  // injeccion de dependencias
  private readonly localStorageService = inject(LocalStorageService);
  private readonly alertStore = inject(AlertStore);
  private readonly uploadService = inject(UploadImgService);
  private readonly cinemaService = inject(CinemaService);
  private readonly snackService = inject(SnackService);

  private HandlerError = HandlerError;

  file!: File;
  formData!: FormData;
  imageUrl: string | null = null;

  session: Session = this.localStorageService.getState().session;

  newSnack = signal<NewSnack | Snack>({
    cinemaId: '',
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    cost: 0,
  });
  cinemaId = signal<string>('');

  ngOnInit(): void {
    this.loadCinema();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['snackUpdate']) {
      if (changes['snackUpdate'].currentValue && this.snackUpdate()) {
        this.newSnack.set({ ...this.snackUpdate()! });
        this.imageUrl = this.snackUpdate()!.imageUrl;
      } else {
        this.newSnack.set({
          name: '',
          cinemaId: '',
          description: '',
          price: 0,
          imageUrl: '',
          cost: 0,
        });
        this.loadCinema();
        this.imageUrl = null;
      }
    }
  }

  async saveSnack() {
    // validar que los campos no estén vacíos
    if (
      this.newSnack().name.trim() === '' ||
      this.newSnack().description.trim() === '' ||
      this.newSnack().price <= 0 ||
      this.newSnack().cinemaId === '' ||
      this.newSnack().imageUrl === '' ||
      this.newSnack().cost <= 0
    ) {
      this.alertStore.addAlert({
        message: 'Por favor, complete todos los campos correctamente.',
        type: 'error',
      });
      return;
    }

    if (this.newSnack().description.length <= 10) {
      this.alertStore.addAlert({
        message: `La descripcion debe tener 10 caracteres como minimo.`,
        type: 'info',
      });
      return;
    }

    if (this.file && !this.snackUpdate()) {
      await this.uplogadImag();
    }
  }

  createSanck() {
    this.snackService.createSnack(this.newSnack()).subscribe({
      next: (snack) => {
        this.onSaveSucces('Snack creado correctamente.');
      },
      error: (err) => {
        console.error('Error al crear el snack:', err);
        const msgDefault = `Error al crear el snack. Inténtelo de nuevo más tarde.`;
        this.HandlerError.handleError(err, this.alertStore, msgDefault);
      },
    });
  }

  updateSnack() {
    this.snackService
      .updateSnack(this.snackUpdate()!.id, this.newSnack() as Snack)
      .subscribe({
        next: (snack) => {
          this.onSaveSucces('Snack actualizado correctamente.');
        },
        error: (err) => {
          console.error('Error al actualizar el snack:', err);
          const msgDefault = `Error al actualizar el snack. Inténtelo de nuevo más tarde.`;
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
      this.newSnack().imageUrl =
        'https://placehold.co/400x200?text=Vista+previa';
    }
  }

  private async uplogadImag(): Promise<void> {
    if (this.formData) {
      try {
        const value = await this.uploadService
          .saveImg(this.formData)
          .toPromise();
        this.newSnack().imageUrl = value.image;
        this.imageUrl = value.image;
      } catch (err) {
        this.newSnack().imageUrl = '';
        throw new Error('Error en uplogadImag');
      }
    }
  }

  onSaveSucces(message: string) {
    this.alertStore.addAlert({
      message: message,
      type: 'success',
    });
    this.newSnack.set({
      cinemaId: this.cinemaId(),
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      cost: 0,
    });
    this.imageUrl = null;
    this.onClose();
    this.saveSucces.emit();
  }

  onClose() {
    this.close.emit();
  }

  loadCinema() {
    this.cinemaService.getCinemaByAdminUserId(this.session.id).subscribe({
      next: (cinema) => {
        if (cinema) {
          this.newSnack().cinemaId = cinema.id;
          this.cinemaId.set(cinema.id);
        }
      },
    });
  }
}
