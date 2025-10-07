import { Routes } from '@angular/router';

const reviewsRoutes: Routes = [
  {
    path: 'homepage',
    loadComponent: () =>
      import('./../../shared/pages/home-page/home-page.component').then(
        (m) => m.HomePageComponent
      ),
  },
  {
    path: 'opinions/hotel/:id',
    loadComponent: () =>
      import('./pages/opinions-page/opinions-page.component').then(
        (m) => m.OpinionsPageComponent
      ),
  },
  {
    path: 'opinions/restaurant/:id',
    loadComponent: () =>
      import('./pages/opinions-restaurant/opinions-restaurant.component').then(
        (m) => m.OpinionsRestaurantComponent
      ),
  },
  {
    path: 'opinions/room/:id',
    loadComponent: () =>
      import('./pages/opinios-rooms/opinios-rooms.component').then(
        (m) => m.OpiniosRoomsComponent
      ),
  },
  {
    path: 'opinions/dishes/:id',
    loadComponent: () =>
      import('./pages/opinions-dishes/opinions-dishes.component').then(
        (m) => m.OpinionsDishesComponent
      ),
  },

  {
    path: 'menu/dishes/:id',
    loadComponent: () =>
      import('./pages/menu-page/menu-page.component').then(
        (m) => m.MenuPageComponent
      ),
  },
];

export const REVIEWS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'homepage',
    pathMatch: 'prefix',
  },
  {
    path: '',
    loadComponent: () =>
      import(
        './../../shared/layout/layout-customer/layout-customer.component'
      ).then((m) => m.LayoutCustomerComponent),
    children: reviewsRoutes,
  },
  {
    path: '**',
    redirectTo: 'homepage',
    pathMatch: 'full',
  },
];
