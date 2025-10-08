import { Routes } from "@angular/router";

const advertiserRoutes: Routes = [
  {
    path:'dashboard', loadComponent: () => import('./pages/dashboard-ads/dashboard-ads.component').then(
      (m) => m.DashboardAdsComponent
    )
  }
];

export const ADVERTISER_ROUTES: Routes = [
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
    children: advertiserRoutes,
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  ];