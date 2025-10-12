import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import {
  Film,
  Armchair,
  Calendar,
  DollarSign,
  Building,
  Clock,
  Tag,
  Popcorn,
  Wallet,
  Star,
  ChartPie,
} from 'lucide-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-cinema',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dashboard-cinema.component.html',
})
export class DashboardCinemaComponent {
  readonly Film = Film;
  readonly Armchair = Armchair;
  readonly Calendar = Calendar;
  readonly DollarSign = DollarSign;
  readonly Building = Building;
  readonly Clock = Clock;
  readonly Tag = Tag;
  readonly Popcorn = Popcorn;
  readonly Wallet = Wallet;
  readonly Star = Star;
  readonly ChartPie = ChartPie;

  private readonly route = inject(Router);

  navigateTo(path: string) {
    this.route.navigate([`cinema/${path}`]);
  }
}
