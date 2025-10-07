import { Routes } from '@angular/router';
import { authGuard } from '@shared/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'session',
    pathMatch: 'full',
  },

  {
    path: 'session',
    loadChildren: () =>
      import('./modules/session/auth.routes').then((m) => m.routes),
  },
  {
    path: 'reservations',
    canActivate: [authGuard],
    data: {
      role: 'CLIENTE',
    },
    loadChildren: () =>
      import('./modules/RESERVATION/reservation.routes').then(
        (m) => m.RESERVATION_ROUTES
      ),
  },
  {
    path: 'reviews',
    canActivate: [authGuard],
    data: {
      role: 'CLIENTE',
    },
    loadChildren: () =>
      import('./modules/REVIEWS/reviews.routes').then(
        (m) => m.REVIEWS_ROUTES
      ),
  },
];
