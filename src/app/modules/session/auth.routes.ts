import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.component') },
  { path: 'register', loadComponent: () => import('./pages/register/register.component') },
  { path: 'confirmation', loadComponent: () => import('./pages/confirmation/confirmation.component') },
  { path: 'find', loadComponent: () => import('./pages/find/find.component') },
  { path: 'recover', loadComponent: () => import('./pages/recover/recover.component') },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
