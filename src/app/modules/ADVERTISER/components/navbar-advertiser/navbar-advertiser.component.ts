import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from 'app/store/auth.store';
import { AdvertiserService } from '../../services/advertiser.service';

@Component({
  selector: 'app-navbar-advertiser',
  imports: [],
  templateUrl: './navbar-advertiser.component.html',
  styleUrl: './navbar-advertiser.component.css'
})
export class NavbarAdvertiserComponent {
  private readonly router = inject(Router);
  readonly authStore = inject(AuthStore);
  private readonly advertiserService = inject(AdvertiserService);

  logout(): void {
    this.authStore.logout();
    this.advertiserService.clearCinema();
  }
}
