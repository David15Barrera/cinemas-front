import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from 'app/store/auth.store';
import { CinemaService } from '../../services/cinema.service';

@Component({
  selector: 'app-navbar-cinema-admin',
  imports: [],
  templateUrl: './navbar-cinema-admin.component.html',
})
export class NavbarCinemaAdminComponent {
  private readonly router = inject(Router);
  readonly authStore = inject(AuthStore);
  private readonly cinemService = inject(CinemaService);

  logout(): void {
    this.authStore.logout();
    this.cinemService.clearCinema();
  }
}
