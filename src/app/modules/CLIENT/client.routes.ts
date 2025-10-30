import { Routes } from "@angular/router";

const clientRoutes: Routes = [
  {
    path:'dashboard',
    loadComponent: () => import('./pages/dashboard-client/dashboard-client.component').then(
      (m) => m.DashboardClientComponent
    )
  },
  {
    path:'catalog',
    loadComponent: () => import('./pages/catalog-client/catalog-client.component').then(
      (m) => m.CatalogClientComponent
    )
  },
    {
    path:'wallet',
    loadComponent: () => import('./pages/client-wallet/client-wallet.component').then(
      (m) => m.ClientWalletComponent
    )
  },
    {
    path:'snacks',
    loadComponent: () => import('./pages/store-snaks/store-snaks.component').then(
      (m) => m.StoreSnaksComponent
    )
  },
    {
    path:'showtimes/:id',
    loadComponent: () => import('./pages/showtime-by-cinema/showtime-by-cinema.component').then(
      (m) => m.ShowtimeByCinemaComponent
    )
  },
    {
    path:'review/:id',
    loadComponent: () => import('./pages/view-review/view-review.component').then(
      (m) => m.ViewReviewComponent
    )
  },
  {
    path:'rooms/:id',
    loadComponent: () => import('./pages/view-rooms/view-rooms.component').then(
      (m) => m.ViewRoomsComponent
    )
  }
  
];


export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/layouts.component').then(
        (m) => m.LayoutsComponent
      ),
    children: clientRoutes,
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  ];
