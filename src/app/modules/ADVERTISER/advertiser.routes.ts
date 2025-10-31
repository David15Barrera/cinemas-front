import { Routes } from "@angular/router";

const advertiserRoutes: Routes = [
  {
    path:'dashboard', loadComponent: () => import('./pages/dashboard-ads/dashboard-ads.component').then(
      (m) => m.DashboardAdsComponent
    )
  },
  {
    path:'ads', loadComponent: () => import('./pages/myads/myads.component').then(
      (m) => m.MyadsComponent
    )
  },
  {
    path:'wallet', loadComponent: () => import('../CLIENT/pages/client-wallet/client-wallet.component').then(
      (m) => m.ClientWalletComponent
    )
  },
  {
    path:'newads', loadComponent: () => import('./pages/create-ads/create-ads.component').then(
      (m) => m.CreateAdsComponent
    )
  }
];

export const ADVERTISER_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'ads',
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