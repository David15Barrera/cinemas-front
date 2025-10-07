import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UrlsUtils } from '@shared/utils/urls';
import { Hotel } from 'app/modules/RESERVATION/models/hotel.interface';
import { HotelService } from 'app/modules/RESERVATION/services/hotel.service';
import { Restaurant } from 'app/modules/REVIEWS/models/restaurant.interface';
import { RestaurantService } from 'app/modules/REVIEWS/services/restaurant.service';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  // inyectar el servicios
  private readonly hotelService = inject(HotelService);
  private readonly route = inject(Router);
  private readonly restaurantService = inject(RestaurantService);

  // utils
  urlsUtils = UrlsUtils;

  // arreglo de hoteles
  hotels = signal<Hotel[]>([]);
  restaurants = signal<Restaurant[]>([]);

  ngOnInit(): void {
    this.getAllHotels();
    this.getAllRestaurants();
  }

  getAllHotels() {
    this.hotelService.getAllHotels().subscribe({
      next: (hotels) => {
        this.hotels.set(hotels);
        this.addImageRandomHotel();
      },
      error: (error) => {
        console.error('Error fetching hotels:', error);
      },
    });
  }

  getAllRestaurants() {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (restaurants) => {
        this.restaurants.set(restaurants);
        this.addImageRandomRestaurant();
      },
      error: (error) => {
        console.error('Error fetching restaurants:', error);
      },
    });
  }

  addImageRandomHotel() {
    this.hotels.update((currentHotels) =>
      currentHotels.map((hotel) => ({
        ...hotel,
        imageUrl: this.urlsUtils.getRandomUrl(),
      }))
    );
  }

  addImageRandomRestaurant() {
    this.restaurants.update((currentRestaurants) =>
      currentRestaurants.map((restaurant) => ({
        ...restaurant,
        imageUrl: this.urlsUtils.getRandomUrlRestaurant(),
      }))
    );
  }

  clickGoOpinionsHotel(hotelId: string) {
    this.route.navigate(['reviews/opinions/hotel', hotelId]);
  }

  clickGoOpinionsRestaurant(hotelId: string) {
    this.route.navigate(['reviews/opinions/restaurant', hotelId]);
  }

  clickGoOpinionsMenu(restaurantId: string) {
    this.route.navigate(['reviews/menu/dishes', restaurantId]);
  }

  goRooms(hotelId: string) {
    this.route.navigate(['/reservations/hotel/rooms', hotelId]);
  }
}
