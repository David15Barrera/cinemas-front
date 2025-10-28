import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Menu, X } from 'lucide-angular';
import { NavbarAdvertiserComponent } from '../components/navbar-advertiser/navbar-advertiser.component';
import { SidebarAdvertiserComponent } from '../components/sidebar-advertiser/sidebar-advertiser.component';

@Component({
  selector: 'app-layouts',
  imports: [RouterModule,
    NavbarAdvertiserComponent,
    SidebarAdvertiserComponent,
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
