import { Component, inject, signal } from '@angular/core';
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
import { CinemaService } from '../../services/cinema.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Session } from 'app/modules/session/models/auth';
import { Cinema } from '../../models/cinema.interface';

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
  private readonly cinemaService = inject(CinemaService);
  private readonly localStorageService = inject(LocalStorageService);

  session: Session = this.localStorageService.getState().session;
  cinema = signal<Cinema>({
    address: '',
    adminUserId: this.session.id,
    dailyCost: 0,
    id: '',
    imageUrl: '',
    name: '',
  });

  ngOnInit() {
    this.loadCinema();
  }

  navigateTo(path: string) {
    this.route.navigate([`cinema/${path}`]);
  }

  loadCinema() {
    this.cinemaService.getCinemaByAdminUserId(this.session.id).subscribe({
      next: (cinema) => {
        if (cinema) {
          this.cinema.set(cinema);
        } else {
          console.warn('No se encontró el cine para este administrador.');
        }
      },
      error: (err) => {
        console.error('Error al obtener el cine:', err);
      },
    });
  }
}
