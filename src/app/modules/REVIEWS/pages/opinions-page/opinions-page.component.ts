import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlsUtils } from '@shared/utils/urls';
import { Hotel } from 'app/modules/RESERVATION/models/hotel.interface';
import { HotelService } from 'app/modules/RESERVATION/services/hotel.service';
import { NewReview, Review } from '../../models/reviews.interface';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Session } from 'app/modules/session/models/auth';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertStore } from 'app/store/alert.store';
import { ReviewsService } from '../../services/reviews.service';
import { HandlerError } from '@shared/utils/handlerError';

@Component({
  selector: 'app-opinions-page',
  imports: [NgClass, CommonModule, FormsModule],
  templateUrl: './opinions-page.component.html',
})
export class OpinionsPageComponent {
  // inyectar el servicios
  private readonly hotelService = inject(HotelService);
  private readonly route = inject(ActivatedRoute);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly alertStore = inject(AlertStore);
  private readonly reviewsService = inject(ReviewsService);
  private readonly router = inject(Router)

  // hangleerError
  private HandlerError = HandlerError;

  // utils
  urlsUtils = UrlsUtils;

  // arreglo de reviews by id del hotel
  reviews = signal<Review[]>([]);

  // hotel seleccionado
  hotel = signal<Hotel | null>(null);

  pinionId!: string;
  hotelImageUrl: string = '';
  session: Session = this.localStorageService.getState().session;
  newReview = signal<NewReview>({
    comment: '',
    rating: 0,
    customerId: this.session.customerId,
    refenceId: this.pinionId,
    typeReference: 'hotel',
  });

  constructor() {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.pinionId = params.get('id')!;
      this.newReview().refenceId = this.pinionId;
      this.getHotelById();
      this.getReviewsByHotelId();
    });

    this.hotelImageUrl = this.urlsUtils.getRandomUrl();
  }

  cleanForm() {
    this.newReview.set({
      comment: '',
      rating: 0,
      customerId: this.session.customerId,
      refenceId: this.pinionId,
      typeReference: 'hotel',
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
    this.hotelService.getHotelById(this.pinionId).subscribe({
      next: (hotel) => {
        this.hotel.set(hotel);
      },
      error: (error) => {
        this.hotel.set(null);
        const msgDefault = 'Error al obtener la información del hotel. ';
        this.HandlerError.handleError(error, this.alertStore, msgDefault);  
      },
    });
  }

  // get opiniones de un hotel segun su id
  getReviewsByHotelId() {
    this.reviewsService.getAllHotels(this.pinionId).subscribe({
      next: (reviews) => {
        this.reviews.set(reviews);
      },
      error: (error) => {
        this.reviews.set([]);
        // TODO: manejar el error
      },
    });
  }

  goRooms(){
    this.router.navigate(['/reservations/hotel/rooms', this.pinionId]);
  }
}
