import { Component } from '@angular/core';
import { NavbarAdminComponent } from "../components/navbar-admin/navbar-admin.component";
import { SidebarAdminComponent } from "../components/sidebar-admin/sidebar-admin.component";
import { LucideAngularModule, Menu, X } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layouts',
  imports: [NavbarAdminComponent,
            SidebarAdminComponent,
            RouterModule,
            LucideAngularModule],
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
