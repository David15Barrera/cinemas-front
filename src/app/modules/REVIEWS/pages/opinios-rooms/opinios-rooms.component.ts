import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { HotelService } from 'app/modules/RESERVATION/services/hotel.service';
import { AlertStore } from 'app/store/alert.store';
import { ReviewsService } from '../../services/reviews.service';
import { HandlerError } from '@shared/utils/handlerError';
import { UrlsUtils } from '@shared/utils/urls';
import { NewReview, Review } from '../../models/reviews.interface';
import { Room } from 'app/modules/RESERVATION/models/room.interface';
import { Session } from 'app/modules/session/models/auth';
import { NgClass, CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalReservationComponent } from "app/modules/RESERVATION/components/modal-reservation/modal-reservation.component";

@Component({
  selector: 'app-opinios-rooms',
  imports: [NgClass, CommonModule, FormsModule, CurrencyPipe, ModalReservationComponent],
  templateUrl: './opinios-rooms.component.html',
})
export class OpiniosRoomsComponent {

  @ViewChild('modalReservation') modalReservation!: ElementRef<HTMLDialogElement>;

  // inyectar el servicios
  private readonly hotelService = inject(HotelService);
  private readonly route = inject(ActivatedRoute);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly alertStore = inject(AlertStore);
  private readonly reviewsService = inject(ReviewsService);
  private readonly router = inject(Router);

  // hangleerError
  private HandlerError = HandlerError;

  // utils
  urlsUtils = UrlsUtils;

  // arreglo de reviews by id del hotel
  reviews = signal<Review[]>([]);

  // room seleccionado
  room = signal<Room | null>(null);

  pinionId!: string;
  roomImageUrl: string = '';
  session: Session = this.localStorageService.getState().session;

  newReview = signal<NewReview>({
    comment: '',
    rating: 0,
    customerId: this.session.customerId,
    refenceId: this.pinionId,
    typeReference: 'room',
  });
  constructor() {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.pinionId = params.get('id')!;
      this.newReview().refenceId = this.pinionId;
      this.getHotelById();
      this.getReviewsByHotelId();
    });

    this.roomImageUrl = this.urlsUtils.getRandomUrlRoom();
  }

  cleanForm() {
    this.newReview.set({
      comment: '',
      rating: 0,
      customerId: this.session.customerId,
      refenceId: this.pinionId,
      typeReference: 'room',
    });
  }

  saveReview() {
    if (
      this.newReview().comment.trim() === '' ||
      this.newReview().rating === 0
    ) {
      this.alertStore.addAlert({
        message: `Por favor, complete todos los campos antes de enviar la opinión.`,
        type: 'info',
      });
      return;
    }

    this.reviewsService.saveReview(this.newReview()).subscribe({
      next: () => {
        this.alertStore.addAlert({
          message: `Gracias por su opinión.`,
          type: 'success',
        });
        // limpiar el formulario
        this.cleanForm();
        // actualizar la lista de opiniones
        this.getReviewsByHotelId();
      },
      error: (error) => {
        const msgDefault = 'Error al enviar la opinión. ';
        this.HandlerError.handleError(error, this.alertStore, msgDefault);
      },
    });
  }

  // get hotel by id
  getHotelById() {
    this.hotelService.getRoomById(this.pinionId).subscribe({
      next: (room) => {
        this.room.set(room);
      },
      error: (error) => {
        this.room.set(null);
        const msgDefault = 'Error al obtener la información de la habitacion. ';
        this.HandlerError.handleError(error, this.alertStore, msgDefault);
      },
    });
  }

  // get opiniones de un hotel segun su id
  getReviewsByHotelId() {
    this.reviewsService.getAllRooms(this.pinionId).subscribe({
      next: (reviews) => {
        this.reviews.set(reviews);
      },
      error: (error) => {
        this.reviews.set([]);
        // TODO: manejar el error
      },
    });
  }

  goRooms() {
    this.router.navigate(['/reservations/hotel/rooms', this.pinionId]);
  }

  openModalReservation() {
    this.modalReservation.nativeElement.showModal();
  }

  closeModalReservation() {
    this.modalReservation.nativeElement.close();
  }
}
