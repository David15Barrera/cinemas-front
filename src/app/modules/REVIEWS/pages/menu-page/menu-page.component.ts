import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { RestaurantService } from '../../services/restaurant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlsUtils } from '@shared/utils/urls';
import { Dishes } from '../../models/restaurant.interface';
import { CurrencyPipe, NgClass } from '@angular/common';
import { PromotionsModalComponent } from '../../components/promotions-modal/promotions-modal.component';

@Component({
  selector: 'app-menu-page',
  imports: [CurrencyPipe, PromotionsModalComponent],
  templateUrl: './menu-page.component.html',
})
export class MenuPageComponent {
  // ref modals
  @ViewChild('modalReservation')
  modalReservation!: ElementRef<HTMLDialogElement>;

  // inyectar services
  private readonly router = inject(Router);
  private readonly restaurantService = inject(RestaurantService);
  private readonly route = inject(ActivatedRoute);

  // utils
  urlsUtils = UrlsUtils;

  pinionId!: string;
  dishes = signal<Dishes[]>([]);
  dishe = signal<Dishes | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.pinionId = params.get('id')!;
      this.getAllDishesByRestaurantId();
    });
  }

  getAllDishesByRestaurantId() {
    this.restaurantService.getAllDishesByRestaurantId(this.pinionId).subscribe({
      next: (dishes) => {
        this.dishes.set(dishes);
        this.addImageRandomDish();
      },
      error: (error) => {
        console.error('Error fetching dishes:', error);
      },
    });
  }

  addImageRandomDish() {
    this.dishes.update((currentHotels) =>
      currentHotels.map((hotel) => ({
        ...hotel,
        urlImage: this.urlsUtils.getRandomUrlDish(),
      }))
    );
  }

  clickGoOpinionsDishes(disehId: string) {
    this.router.navigate(['reviews/opinions/dishes', disehId]);
  }

  closeModalReservation() {
    this.modalReservation.nativeElement.close();
  }

  openModalReservation(dishe: Dishes) {
    this.dishe.set(dishe);
    this.modalReservation.nativeElement.showModal();
  }
}
