import { Routes } from "@angular/router";

const adminRoutes: Routes = [
  {
    path:'dashboard', loadComponent: () => import('./pages/dashboard-admin/dashboard-admin.component').then(
      (m) => m.DashboardAdminComponent
    )
  },
  {
    path:'employees', loadComponent: () => import('./pages/employees/employees/employees.component').then(
      (m) => m.EmployeesComponent
    )
  },
  {
    path:'movies-admin', loadComponent: () => import('./pages/movies/movies-admin/movies-admin.component').then(
      (m) => m.MoviesAdminComponent
    )
  },{
    path:'movie-detail/:id', loadComponent: () => import('./pages/movies/movies-detail/movies-detail.component').then(
      (m) => m.MoviesDetailComponent
    )
  },
  {
    path:'cinemas-admin', loadComponent: () => import('./pages/cinemas/cinema-admin/cinema-admin.component').then(
      (m) => m.CinemaAdminComponent
    )
  },{
    path: 'reviews-movie/:id', loadComponent: () => import('./pages/movies/reviews/reviews.component').then(
      (m) => m.ReviewsComponent
    )
  },
  {
    path:'ads-admin', loadComponent: () => import('./pages/ads/ads-admin/ads-admin.component').then(
      (m) => m.AdsAdminComponent
    )
  },
  {
    path:'setting-general', loadComponent: () => import('./pages/setting-general/setting-general.component').then(
      (m) => m.SettingGeneralComponent
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