import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { AlertStore } from 'app/store/alert.store';
import { ReviewsService } from '../../services/reviews.service';
import { HandlerError } from '@shared/utils/handlerError';
import { UrlsUtils } from '@shared/utils/urls';
import { NewReview, Review } from '../../models/reviews.interface';
import { Restaurant } from '../../models/restaurant.interface';
import { Session } from 'app/modules/session/models/auth';
import { NgClass, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeFormatPipePipe } from '@shared/pipes/TimeFormatPipe.pipe';

@Component({
  selector: 'app-opinions-restaurant',
  imports: [NgClass, CommonModule, FormsModule, TimeFormatPipePipe],
  templateUrl: './opinions-restaurant.component.html',
})
export class OpinionsRestaurantComponent {
  // inyectar el servicios
  private readonly route = inject(ActivatedRoute);
  private readonly restaurantService = inject(RestaurantService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly alertStore = inject(AlertStore);
  private readonly reviewsService = inject(ReviewsService);

  // hangleerError
  HandlerError = HandlerError;

  // utils
  urlsUtils = UrlsUtils;

  // arreglo de reviews by id del restaurant
  reviews = signal<Review[]>([]);

  // restaurant seleccionado
  restaurant = signal<Restaurant | null>(null);

  pinionId!: string;
  restaurantImageUrl: string = '';
  session: Session = this.localStorageService.getState().session;

  // modelo envio review
  newReview = signal<NewReview>({
    comment: '',
    rating: 0,
    customerId: this.session.customerId,
    refenceId: this.pinionId,
    typeReference: 'restaurant',
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.pinionId = params.get('id')!;
      this.newReview().refenceId = this.pinionId;
      this.getRestaurantById();
      this.getReviewsByRestaurantId();
    });

    this.restaurantImageUrl = this.urlsUtils.getRandomUrlRestaurant();
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
        this.getReviewsByRestaurantId();
      },
      error: (error) => {
        const msgDefault = 'Error al enviar la opinión. ';
        this.HandlerError.handleError(error, this.alertStore, msgDefault);
      },
    });
  }

  getRestaurantById() {
    this.restaurantService.getRestaurantById(this.pinionId).subscribe({
      next: (restaurant) => {
        this.restaurant.set(restaurant);
      },
      error: (error) => {
        const msgDefault = 'Error al obtener el restaurante. ';
        this.HandlerError.handleError(error, this.alertStore, msgDefault);
      },
    });
  }

  getReviewsByRestaurantId() {
    this.reviewsService.getAllRestaurant(this.pinionId).subscribe({
      next: (reviews) => {
        this.reviews.set(reviews);        
      },
      error: (error) => {
        this.reviews.set([]);
        // TODO: manejar el error
      },
    });
  }
}
