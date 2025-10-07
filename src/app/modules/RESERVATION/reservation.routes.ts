import { Routes } from '@angular/router';

const reservationRoutes: Routes = [
  {
    path: 'my-reservations',
    loadComponent: () =>
      import(
        './pages/my-reservations-page/my-reservations-page.component'
      ).then((m) => m.MyReservationsPageComponent),
  },
  {
    path: 'hotel/rooms/:id',
    loadComponent: () =>
      import('./pages/rooms-page/rooms-page.component').then(
        (m) => m.RoomsPageComponent
      ),
  },
];

export const RESERVATION_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'my-reservations',
    pathMatch: 'prefix',
  },
  {
    path: '',
    loadComponent: () =>
      import(
        './../../shared/layout/layout-customer/layout-customer.component'
      ).then((m) => m.LayoutCustomerComponent),
    children: reservationRoutes,
  },
  {
    path: '**',
    redirectTo: 'my-reservations',
    pathMatch: 'full',
  },
];
