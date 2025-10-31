import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  LayoutDashboard,
  Users,
  Video,
  Home,
  DollarSign,
  ChartPie,
  Menu,
  X,
  Settings,
  Star,
  ClipboardList
} from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-sidebar-admin',
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar-admin.component.html',
  styleUrl: './sidebar-admin.component.css'
})
export class SidebarAdminComponent {

// Iconos iniciales
  readonly Menu = Menu;
  public readonly Close = X;
  public readonly Dashboard = LayoutDashboard;
  public readonly Users = Users; 
  public readonly Settings = Settings;
  public readonly ClipboardList = ClipboardList;

  // --- MIs iconos ---
  public readonly Video = Video;
  public readonly Home = Home;
  public readonly DollarSign = DollarSign;
  public readonly PieChart = ChartPie;

  isCollapsed = true;

  toggleCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }

}
