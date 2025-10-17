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
    path:'wallet', loadComponent: () => import('./pages/advertiser-wallet/advertiser-wallet.component').then(
      (m) => m.AdvertiserWalletComponent
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