import {
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
} from '@angular/core';
import {
  NewReservation,
  Reservation,
} from '../../models/reservation.interface';
import { Promotion } from '../../models/promotion.interface';
import { ReservationService } from '../../services/Reservation.service';
import { PromotionService } from '../../services/Promotion.service';
import { Session } from 'app/modules/session/models/auth';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { DatePipe } from '@angular/common';
import { AlertStore } from 'app/store/alert.store';
import { Room } from '../../models/room.interface';
import { HandlerError } from '@shared/utils/handlerError';

@Component({
  selector: 'app-modal-reservation',
  imports: [DatePipe],
  templateUrl: './modal-reservation.component.html',
})
export class ModalReservationComponent {
  // output
  @Output() close = new EventEmitter<void>();

  // input
  roomId = input.required<string>();
  room = input.required<Room | null>();

  //iject services
  private readonly reservationService = inject(ReservationService);
  private readonly promotionService = inject(PromotionService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly alertStore = inject(AlertStore);

  private HandlerError = HandlerError;

  // catalogos
  reservations = signal<Reservation[]>([]);
  promotionRoom = signal<Promotion | null>(null);
  promotionCustomer = signal<Promotion | null>(null);

  session: Session = this.localStorageService.getState().session;

  // variables de input
  starDate = signal<string>('');
  endDate = signal<string>('');

  discount = signal<number>(0);

  constructor() {
    this.discount.set(0);
    this.starDate.set('');
    this.endDate.set('');
  }

  ngOnInit(): void {
    this.discount.set(0);
    this.starDate.set('');
    this.endDate.set('');
    this.getPromotionByRoomId();
    this.getReservationsByRoomId();
    this.getPromotionByCustomerId(this.session.customerId);
  }

  ngOnChanges(): void {
    this.discount.set(0);
    this.starDate.set('');
    this.endDate.set('');
    this.getPromotionByRoomId();
    this.getReservationsByRoomId();
    this.getPromotionByCustomerId(this.session.customerId);
  }

  onClose() {
    this.close.emit();
  }

  total = computed(() => {
    const start = this.starDate();
    const end = this.endDate();

    if (!start || !end) return 0;
    // Normalizar la fecha actual en formato yyyy-MM-dd
    const todayStr = this.getTodayStr();

    // Validar que fecha inicio sea <= fecha final
    if (start > end) return 0;

    if (start < todayStr) return 0;

    // calcular diferencia en días (incluyendo el último día)
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate.getTime() - startDate.getTime();
    if (diffTime < 0) return 0;

    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const subtotal = days * this.room()?.pricePerDay!;
    const discountAmount = subtotal * (this.discount() / 100);

    return subtotal - discountAmount;
  });

  // get promotion by room id
  getPromotionByRoomId() {
    this.promotionService.getAllPromotionsByRoomId(this.roomId()).subscribe({
      next: (promotions) => {
        if (promotions.length > 0) {
          this.promotionRoom.set(promotions[0]);
          this.discount.update(
            (current) => current + promotions[0].discountPercentage
          );
        } else {
          this.promotionRoom.set(null);
        }
      },
      error: (error) => {
        console.error('Error fetching promotions by room ID:', error);
        this.promotionRoom.set(null);
      },
    });
  }

  // get promotion by customer id
  getPromotionByCustomerId(customerId: string) {
    this.promotionService.getAllPromotionsByCustomerId(customerId).subscribe({
      next: (promotions) => {
        if (promotions.length > 0) {
          this.promotionCustomer.set(promotions[0]);
          this.discount.update(
            (current) => current + promotions[0].discountPercentage
          );
        } else {
          this.promotionCustomer.set(null);
        }
      },
      error: (error) => {
        console.error('Error fetching promotions by customer ID:', error);
        this.promotionCustomer.set(null);
      },
    });
  }

  // get reservation by room id
  getReservationsByRoomId() {
    this.reservationService
      .getAllReservationCurrentByRoomId(this.roomId())
      .subscribe({
        next: (reservations) => {
          this.reservations.set(reservations);
        },
        error: (error) => {
          console.error('Error fetching reservations by room ID:', error);
          this.reservations.set([]);
        },
      });
  }

  // save reservation
  saveReservation() {
    const start = this.starDate();
    const end = this.endDate();

    // Validar que no estén vacías
    if (!start || !end) {
      this.alertStore.addAlert({
        message: 'Por favor, ingrese las fechas a reservar.',
        type: 'info',
      });
      return;
    }

    // Normalizar la fecha actual en formato yyyy-MM-dd
    const todayStr = this.getTodayStr();

    // Validar que fecha inicio sea <= fecha final
    if (start > end) {
      this.alertStore.addAlert({
        message: 'La fecha de inicio no puede ser mayor que la fecha final.',
        type: 'info',
      });
      return;
    }

    // Validar que fecha inicio sea >= fecha actual
    if (start < todayStr) {
      this.alertStore.addAlert({
        message: 'La fecha de inicio no puede ser menor a la fecha actual.',
        type: 'info',
      });
      return;
    }

    // Validar que no haya conflictos con reservas existentes
    const hasConflict = this.reservations().some((reservation) => {
      return start <= reservation.endDate && end >= reservation.startDate;
    });

    if (hasConflict) {
      this.alertStore.addAlert({
        message:
          'Las fechas seleccionadas entran en conflicto con una reserva existente.',
        type: 'warning',
      });
      return;
    }

    const newReservation: NewReservation = {
      startDate: start,
      endDate: end,
      customerId: this.session.customerId,
      roomId: this.roomId(),
    };

    this.reservationService.saveReservation(newReservation).subscribe({
      next: (reservation) => {
        this.alertStore.addAlert({
          message: 'Reserva creada exitosamente.',
          type: 'success',
        });
        this.onClose();
      },
      error: (error) => {
        const msgDefault =
          'Error al crear la reserva. Por favor, intente de nuevo.';
        this.HandlerError.handleError(error, this.alertStore, msgDefault);
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
