import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Menu, X } from 'lucide-angular';
import { NavbarCinemaAdminComponent } from '../components/navbar-cinema-admin/navbar-cinema-admin.component';
import { SidebarCinemaAdminComponent } from '../components/sidebar-cinema-admin/sidebar-cinema-admin.component';

@Component({
  selector: 'app-layouts',
  imports: [
    RouterModule,
    NavbarCinemaAdminComponent,
    SidebarCinemaAdminComponent,
    LucideAngularModule,
  ],
  templateUrl: './layouts.component.html',
})
export class LayoutsComponent {
  readonly Hamburger = Menu;
  readonly X = X;

  sidebarCollapsed = true;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
