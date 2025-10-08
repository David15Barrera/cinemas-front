import { Routes } from "@angular/router";

const clientRoutes: Routes = [
  {
    path:'dashboard',
    loadComponent: () => import('./pages/dashboard-client/dashboard-client.component').then(
      (m) => m.DashboardClientComponent
    )
  }  
];


export const CLIENT_ROUTES: Routes = [
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
    children: clientRoutes,
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  ];
