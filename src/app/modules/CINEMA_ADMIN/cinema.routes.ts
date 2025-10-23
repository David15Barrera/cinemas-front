import { Routes } from '@angular/router';
import { hasCinemaGuard } from './guard/HasCinema.guard';

const cinemaAdminRoutes: Routes = [
  {
    path: 'dashboard',
    canActivate: [hasCinemaGuard],
    loadComponent: () =>
      import('./pages/dashboard-cinema/dashboard-cinema.component').then(
        (m) => m.DashboardCinemaComponent
      ),
  },
  {
    path: 'global-settings',
    loadComponent: () =>
      import(
        './pages/global-settings-page/global-settings-page.component'
      ).then((m) => m.GlobalSettingsPageComponent),
  },
  {
    path: 'rooms',
    canActivate: [hasCinemaGuard],
    loadComponent: () =>
      import('./pages/rooms-page/rooms-page.component').then(
        (m) => m.RoomsPageComponent
      ),
  },
  {
    path: 'schedules',
    canActivate: [hasCinemaGuard],
    loadComponent: () =>
      import('./pages/schedules-page/schedules-page.component').then(
        (m) => m.SchedulesPageComponent
      ),
  },
  {
    path: 'snacks',
    canActivate: [hasCinemaGuard],
    loadComponent: () =>
      import('./pages/snacks-page/snacks-page.component').then(
        (m) => m.SnacksPageComponent
      ),
  },
  {
    path: 'reviews/:type/:id',
    canActivate: [hasCinemaGuard],
    loadComponent: () =>
      import('./pages/reviews-target-type/reviews-target-type.component').then(
        (m) => m.ReviewsTargetTypeComponent
      ),
  },
];

export const CINEMA_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'prefix',
  },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/layouts.component').then((m) => m.LayoutsComponent),
    children: cinemaAdminRoutes,
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
