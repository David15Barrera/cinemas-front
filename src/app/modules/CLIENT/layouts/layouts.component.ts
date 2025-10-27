import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarClientComponent } from '../components/navbar-client/navbar-client.component';
import { LucideAngularModule, Menu, X } from 'lucide-angular';
import { SidebarClientComponent } from '../components/sidebar-client/sidebar-client.component';

@Component({
  selector: 'app-layouts',
  imports: [
    RouterModule,
    NavbarClientComponent,
    SidebarClientComponent,
    LucideAngularModule,
  ],
  templateUrl: './layouts.component.html',
  styleUrl: './layouts.component.css'
})
export class LayoutsComponent {
  readonly Hamburger = Menu;
  readonly X = X;

  sidebarCollapsed = true;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
