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
  Settings,
  Star
} from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-sidebar-admin',
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar-admin.component.html',
  styleUrl: './sidebar-admin.component.css'
})
export class SidebarAdminComponent {

    readonly Menu = Menu;
  readonly Close = X;
  readonly Dashboard = LayoutDashboard;
  readonly Rooms = Armchair;
  readonly Schedules = Clock;
  readonly Promotions = Tag;
  readonly Snacks = Popcorn;
  readonly Wallet = Wallet;
  readonly Users = ChartPie;
  readonly Settings = Settings;
  readonly Reviews = Star;

  isCollapsed = true;

  toggleCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }

}
