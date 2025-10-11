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
    path: 'admin',
    canActivate: [authGuard],
    data: {
      role: 'ADMIN_SIS',
    },
    loadChildren: () =>
      import('./modules/ADMIN/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'adviertiser',
    canActivate: [authGuard],
    data: {
      role: 'ANUNCIADOR',
    },
    loadChildren: () =>
      import('./modules/ADVERTISER/advertiser.routes').then(
        (m) => m.ADVERTISER_ROUTES
      ),
  },
  {
    path: 'cinema',
    canActivate: [authGuard],
    data: {
      role: 'ADMIN_CINE',
    },
    loadChildren: () =>
      import('./modules/CINEMA_ADMIN/cinema.routes').then(
        (m) => m.CINEMA_ROUTES
      ),
  },
  {
    path: 'client',
    canActivate: [authGuard],
    data: {
      role: 'CLIENTE',
    },
    loadChildren: () =>
      import('./modules/CLIENT/client.routes').then((m) => m.CLIENT_ROUTES),
  },
];
