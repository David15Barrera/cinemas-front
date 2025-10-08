import { Routes } from "@angular/router";

const adminRoutes: Routes = [
  {
    path:'dashboard', loadComponent: () => import('./pages/dashboard-admin/dashboard-admin.component').then(
      (m) => m.DashboardAdminComponent
    )
  }

];

export const ADMIN_ROUTES: Routes = [
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
    children: adminRoutes,
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  ];