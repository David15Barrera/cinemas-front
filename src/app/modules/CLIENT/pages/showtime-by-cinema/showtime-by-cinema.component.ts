import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Film, AlertCircle, Clock, Monitor, Calendar, DollarSign, ShoppingCart, Filter, X, ArrowLeft } from 'lucide-angular';
import { ShowTime } from 'app/modules/CINEMA_ADMIN/models/showtimes.interface';
import { MovieService } from 'app/modules/CINEMA_ADMIN/services/movie.service';
import { ShowtimesService } from 'app/modules/CINEMA_ADMIN/services/showtimes.service';
import { CinemaService } from 'app/modules/CINEMA_ADMIN/services/cinema.service';
import { Cinema } from 'app/modules/CINEMA_ADMIN/models/cinema.interface';
import { ImagePipe } from '@shared/pipes/image.pipe';
import { AlertStore } from 'app/store/alert.store';

interface FilterOptions {
  selectedDate: string;
  selectedTime: string;
}

@Component({
  selector: 'app-showtime-by-cinema',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    ImagePipe
  ],
  templateUrl: './showtime-by-cinema.component.html',
  styleUrl: './showtime-by-cinema.component.css'
})
export class ShowtimeByCinemaComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  public readonly _router = inject(Router);
  private readonly _showTimeService = inject(ShowtimesService);
  private readonly _movieService = inject(MovieService);
  private readonly _cinemaService = inject(CinemaService);
  private readonly _alertStore = inject(AlertStore)

  Film = Film;
  AlertCircle = AlertCircle;
  Clock = Clock;
  Monitor = Monitor;
  Calendar = Calendar;
  DollarSign = DollarSign;
  ShoppingCart = ShoppingCart;
  Filter = Filter;
  X = X;
  ArrowLeft = ArrowLeft;

  cinemaId!: string;
  cinemaName: string = 'Cargando...';
  showTimes: ShowTime[] = [];
  filteredShowTimes: ShowTime[] = [];

  filters: FilterOptions = {
    selectedDate: '',
    selectedTime: ''
  };

  availableDates: string[] = [];
  availableTimes: string[] = ['morning', 'afternoon', 'evening', 'night'];

  timeRanges = {
    morning: { label: 'Mañana (6:00 - 12:00)', start: 6, end: 12 },
    afternoon: { label: 'Tarde (12:00 - 18:00)', start: 12, end: 18 },
    evening: { label: 'Noche (18:00 - 22:00)', start: 18, end: 22 },
    night: { label: 'Trasnoche (22:00 - 6:00)', start: 22, end: 30 }
  };

  showFilters = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let id = params.get('id');
      if (id != null) {
        this.cinemaId = id;
        this.loadCinemaInfo();
        this.loadShowTimes();
      }
    });
  }

  loadCinemaInfo() {
    this._cinemaService.getCinemaById(this.cinemaId).subscribe({
      next: (cinema) => {
        this.cinemaName = cinema.name;
      },
      error: (error) => {
        console.error('Error al cargar información del cine:', error);
        this.cinemaName = 'Cine';
      }
    });
  }

  loadShowTimes() {
    this._showTimeService.getShowTimesByCinemaId(this.cinemaId).subscribe({
      next: (response) => {
        this.showTimes = response;
        this.extractAvailableDates();
        this.applyFilters();
        const uniqueMovieIds = [...new Set(this.showTimes.map(st => st.movieId))];
          uniqueMovieIds.forEach(movieId => {
            this._movieService.getMovieById(movieId).subscribe({
              next: (movieResponse) => {
                const movie = Array.isArray(movieResponse) ? movieResponse[0] : movieResponse;
                this.showTimes
                  .filter(st => st.movieId === movieId)
                  .forEach(st => st.movie = movie);

                this.applyFilters();
              },
              error: (err) => console.error(`Error al cargar película ${movieId}:`, err)
            });
          });

      },
      error: (error) => {
        this._alertStore.addAlert({
        message: 'Error al cargar las funciones. Inténtalo de nuevo.',
        type: 'error',
      });
      }
    });
  }

  extractAvailableDates() {
    const dates = this.showTimes.map(st => {
      const date = new Date(st.startTime);
      return date.toISOString().split('T')[0];
    });
    
    this.availableDates = [...new Set(dates)].sort();
  }

  applyFilters() {
    let filtered = [...this.showTimes];

    if (this.filters.selectedDate) {
      filtered = filtered.filter(st => {
        const showDate = new Date(st.startTime).toISOString().split('T')[0];
        return showDate === this.filters.selectedDate;
      });
    }

    if (this.filters.selectedTime) {
      filtered = filtered.filter(st => {
        const hour = new Date(st.startTime).getHours();
        const range = this.timeRanges[this.filters.selectedTime as keyof typeof this.timeRanges];
        
        if (range.start < range.end) {
          return hour >= range.start && hour < range.end;
        } else {
          return hour >= range.start || hour < 6;
        }
      });
    }

    this.filteredShowTimes = filtered;
  }

  clearFilters() {
    this.filters = {
      selectedDate: '',
      selectedTime: ''
    };
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return this.filters.selectedDate !== '' || this.filters.selectedTime !== '';
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  formatDateLabel(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateOnly = date.toISOString().split('T')[0];
    const todayOnly = today.toISOString().split('T')[0];
    const tomorrowOnly = tomorrow.toISOString().split('T')[0];

    if (dateOnly === todayOnly) return 'Hoy';
    if (dateOnly === tomorrowOnly) return 'Mañana';

    return date.toLocaleDateString('es-GT', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  buyTicket(showTime: ShowTime) {
    console.log('Comprando ticket para:', showTime);
    // this._router.navigate(['/client/ticket-purchase', showTime.id]);
  }
}