import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  LayoutDashboard,
  Armchair,
  Clock,
  Tag,
  Popcorn,
  Wallet,
  ChartPie,
  Menu,
  X,
} from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-sidebar-cinema-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar-cinema-admin.component.html',
})
export class SidebarCinemaAdminComponent {
  readonly Menu = Menu;
  readonly Close = X;
  readonly Dashboard = LayoutDashboard;
  readonly Rooms = Armchair;
  readonly Schedules = Clock;
  readonly Promotions = Tag;
  readonly Snacks = Popcorn;
  readonly Wallet = Wallet;
  readonly Reports = ChartPie;

  isCollapsed = true;

  toggleCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }
}