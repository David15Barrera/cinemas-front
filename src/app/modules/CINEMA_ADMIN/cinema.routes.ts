import { Routes } from "@angular/router";

const cinemaAdminRoutes: Routes = [
    {
      path:'dashboard', loadComponent: () => import('./pages/dashboard-cinema/dashboard-cinema.component').then(
        (m) => m.DashboardCinemaComponent
      )
    }
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
      import('./layouts/layouts.component').then(
        (m) => m.LayoutsComponent
      ),
    children: cinemaAdminRoutes,
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  ];