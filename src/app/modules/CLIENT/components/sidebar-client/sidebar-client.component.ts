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
  Star,
  Megaphone
} from 'lucide-angular';

@Component({
  selector: 'app-sidebar-client',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar-client.component.html',
  styleUrls: ['./sidebar-client.component.css']
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
  readonly Megaphone = Megaphone;

  isCollapsed = true;

  toggleCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }
}
