import {
  Component,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { HandlerError } from '@shared/utils/handlerError';
import { NewPromotion, Promotion } from '../../models/promotion.interface';
import { Room } from '../../models/room.interface';
import { Customer } from '@shared/models/customer.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  Percent,
  Tag,
  FileText,
  Calendar,
  Users,
  DoorOpen,
  Popcorn,
  Film,
  Clock,
  Save,
  X,
  AlertCircle,
  LucideAngularModule,
} from 'lucide-angular';
import { AlertStore } from 'app/store/alert.store';
import { PromotionService } from '../../services/promotion.service';
import { Movie } from '../../models/movie.interface';

@Component({
  selector: 'app-form-promotion',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './form-promotion.component.html',
})
export default class FormPromotionComponent {
  // Lucide icons
  readonly Percent = Percent;
  readonly Tag = Tag;
  readonly FileText = FileText;
  readonly Calendar = Calendar;
  readonly Users = Users;
  readonly DoorOpen = DoorOpen;
  readonly Popcorn = Popcorn;
  readonly Film = Film;
  readonly Clock = Clock;
  readonly Save = Save;
  readonly X = X;
  readonly AlertCircle = AlertCircle;
  // evento para cerrar el modal
  @Output() close = new EventEmitter<void>();
  @Output() saveSucces = new EventEmitter<void>();

  // input para editar
  promotionUpdate = input<Promotion | null>(null);
  cinemaId = input<string>('');

  // catalogos
  rooms = input<Room[]>([]);
  movies = input<Movie[]>([]);
  customers = input<Customer[]>([]);
  promotionType = signal<'ROOM' | 'MOVIE' | 'CLIENT'>('ROOM');

  // injeccion de dependencias
  private readonly alertStore = inject(AlertStore);
  private readonly promotionService = inject(PromotionService);
  private HandlerError = HandlerError;

  newPromotion = signal<NewPromotion | Promotion>({
    cinemaId: this.cinemaId(),
    title: '',
    description: '',
    discountPercentage: 0,
    targetId: '',
    targetType: 'ROOM',
    startDate: '',
    endDate: '',
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['promotionUpdate']) {
      if (changes['promotionUpdate'].currentValue && this.promotionUpdate()) {
        this.newPromotion.set({ ...this.promotionUpdate()! });
        this.promotionType.set(this.promotionUpdate()!.targetType);
      } else {
        this.newPromotion.set({
          cinemaId: this.cinemaId(),
          title: '',
          description: '',
          discountPercentage: 0,
          targetId: '',
          targetType: 'ROOM',
          startDate: '',
          endDate: '',
        });
        this.promotionType.set('ROOM');
      }
    }
  }

  onTypeChange(type: 'ROOM' | 'MOVIE' | 'CLIENT') {
    this.promotionType.set(type);
    this.newPromotion.update((promo) => ({
      ...promo,
      targetType: type,
      targetId: '', // Reset targetId when type changes
    }));
  }

  get currentCatalog() {
    switch (this.promotionType()) {
      case 'ROOM':
        return this.rooms();
      case 'MOVIE':
        return this.movies();
      case 'CLIENT':
        return this.customers();
      default:
        return [];
    }
  }

  closeModal() {
    this.close.emit();
  }

  savePromotion() {
    // Validaciones básicas
    if (!this.newPromotion().title.trim()) {
      this.alertStore.addAlert({
        message: 'El título es requerido.',
        type: 'info',
      });
      return;
    }
    if (!this.newPromotion().description.trim() || this.newPromotion().description.length < 10) {
      this.alertStore.addAlert({
        message: 'La descripción es requerida y debe tener al menos 10 caracteres.',
        type: 'info',
      });
      return;
    }
    if (
      this.newPromotion().discountPercentage <= 0 ||
      this.newPromotion().discountPercentage > 100
    ) {
      this.alertStore.addAlert({
        message: 'El porcentaje de descuento debe estar entre 1 y 100',
        type: 'info',
      });
      return;
    }
    if (!this.newPromotion().targetId) {
      this.alertStore.addAlert({
        message: 'Debes seleccionar un objetivo para la promoción',
        type: 'info',
      });
      return;
    }
    if (!this.newPromotion().startDate || !this.newPromotion().endDate) {
      this.alertStore.addAlert({
        message: 'Las fechas de inicio y fin son requeridas',
        type: 'info',
      });
      return;
    }

    // Normalizar la fecha actual en formato yyyy-MM-dd
    const todayStr = this.getTodayStr();

    // Validar que fecha inicio sea >= fecha actual
    if (this.newPromotion().startDate < todayStr) {
      this.alertStore.addAlert({
        message: 'La fecha de inicio no puede ser menor a la fecha actual.',
        type: 'info',
      });
      return;
    }

    // Validar que fecha fin sea >= fecha inicio
    if (this.newPromotion().endDate < this.newPromotion().startDate) {
      this.alertStore.addAlert({
        message: 'La fecha de fin no puede ser menor a la fecha de inicio.',
        type: 'info',
      });
      return;
    }

    if (this.promotionUpdate()) {
      this.updatePromotion();
    } else {
      this.createPromotion();
    }
  }

  createPromotion() {
    this.promotionService
      .createPromotion(this.newPromotion() as NewPromotion)
      .subscribe({
        next: (promotion) => {
          this.alertStore.addAlert({
            message: 'Promoción creada correctamente.',
            type: 'success',
          });
          this.saveSucces.emit();
          this.closeModal();
        },
        error: (err) => {
          const msgDefault = 'Error al crear la promoción.';
          this.HandlerError.handleError(err, this.alertStore, msgDefault);
        },
      });
  }

  updatePromotion() {
    this.promotionService
      .updatePromotion(
        this.promotionUpdate()!.id,
        this.newPromotion() as Promotion
      )
      .subscribe({
        next: (promotion) => {
          this.alertStore.addAlert({
            message: 'Promoción actualizada correctamente.',
            type: 'success',
          });
          this.saveSucces.emit();
          this.closeModal();
        },
        error: (err) => {
          const msgDefault = 'Error al actualizar la promoción.';
          this.HandlerError.handleError(err, this.alertStore, msgDefault);
        },
      });
  }

  getTodayStr(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
