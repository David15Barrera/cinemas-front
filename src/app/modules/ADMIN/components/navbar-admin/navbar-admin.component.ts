import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from 'app/store/auth.store';
@Component({
  selector: 'app-navbar-admin',
  imports: [],
  templateUrl: './navbar-admin.component.html',
  styleUrl: './navbar-admin.component.css'
})
export class NavbarAdminComponent {
 private readonly router = inject(Router);
  readonly authStore = inject(AuthStore);

    logout(): void {
    this.authStore.logout();
  }
  
}
