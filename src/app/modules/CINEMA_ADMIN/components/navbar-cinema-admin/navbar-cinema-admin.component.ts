import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from 'app/store/auth.store';

@Component({
  selector: 'app-navbar-cinema-admin',
  imports: [],
  templateUrl: './navbar-cinema-admin.component.html',
})
export class NavbarCinemaAdminComponent {
  private readonly router = inject(Router);
  readonly authStore = inject(AuthStore);
}
