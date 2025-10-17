import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
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

@Component({
  selector: 'app-sidebar-client',
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar-client.component.html',
  styleUrl: './sidebar-client.component.css'
})
export class SidebarClientComponent {
  readonly Menu = Menu;
  readonly Close = X;
  readonly Dashboard = LayoutDashboard;
  readonly Rooms = Armchair;
  readonly Schedules = Clock;
  readonly Promotions = Tag;
  readonly Snacks = Popcorn;
  readonly Wallet = Wallet;
  readonly Reports = ChartPie;
  readonly Settings = Settings;
  readonly Reviews = Star;

  isCollapsed = true;

  toggleCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }
}
