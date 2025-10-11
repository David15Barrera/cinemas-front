import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  Users,
  DoorOpen,
  FileText,
  Settings,
  LucideAngularModule,
  Menu,
  X,
  Shield,
  ChartPie,
} from 'lucide-angular';

@Component({
  selector: 'app-sidebar-cinema-admin',
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar-cinema-admin.component.html',
})
export class SidebarCinemaAdminComponent {
  readonly Menu = Menu;
  readonly Close = X;
  readonly Users = Users;
  readonly Rooms = DoorOpen;
  readonly Reports = ChartPie;
  readonly Settings = Settings;
  readonly AdminShield = Shield;
  readonly FileText = FileText;

  isCollapsed = true;

  toggleCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }
}
