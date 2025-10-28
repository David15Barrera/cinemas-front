import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from 'app/store/auth.store';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-navbar-client',
  imports: [],
  templateUrl: './navbar-client.component.html',
  styleUrl: './navbar-client.component.css'
})
export class NavbarClientComponent {
  private readonly router = inject(Router);
  readonly authStore = inject(AuthStore);
  private readonly clientService = inject(ClientService);

  logout(): void {
    this.authStore.logout();
    this.clientService.clearCinema();
  }
}
