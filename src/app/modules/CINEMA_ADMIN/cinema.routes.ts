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
