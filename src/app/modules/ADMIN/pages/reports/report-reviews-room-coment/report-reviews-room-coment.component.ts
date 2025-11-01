import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TargetTypeReview } from 'app/modules/CINEMA_ADMIN/models/review.interface';
import { CompanyInfo, ColumnDefinition, generateReportPDF } from 'app/utils/pdf-generator.utils';
import { CinemaService } from 'app/modules/CINEMA_ADMIN/services/cinema.service';
import { ReviewsService } from 'app/modules/CINEMA_ADMIN/services/reviews.service';
import { forkJoin } from 'rxjs';
import { LucideAngularModule, Filter, X, Download, Film, Users, Calendar, AlertCircle } from 'lucide-angular';
import { AlertStore } from 'app/store/alert.store';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Session } from 'app/modules/session/models/auth';
import { Cinema } from 'app/modules/CINEMA_ADMIN/models/cinema.interface';

type RoomWithCinema = TargetTypeReview & { cinemaName?: string, cinemaId: string };

@Component({
  selector: 'app-report-reviews-room-coment',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './report-reviews-room-coment.component.html',
  styleUrl: './report-reviews-room-coment.component.css'
})
export class ReportReviewsRoomComentComponent implements OnInit {
  private readonly _reviewsService = inject(ReviewsService);
  private readonly _cinemaService = inject(CinemaService);
  private readonly _alertStore = inject(AlertStore);
  private readonly _localStorageService = inject(LocalStorageService)

  readonly Filter = Filter;
  readonly X = X;
  readonly Download = Download;
  readonly Film = Film;
  readonly Users = Users;
  readonly Calendar = Calendar;
  readonly AlertCircle = AlertCircle;

  // Estado
  rooms: RoomWithCinema[] = [];
  filteredRooms: RoomWithCinema[] = [];
  allCinemas: Cinema[] = [];
  loading = false;
  showFilters = false;

  filters = {
    startDate: '',
    endDate: '',
    cinemaId: ''
  };

  session: Session = this._localStorageService.getState().session;

  ngOnInit() {
    this.loadAllRoomsFromAllCinemas();
  }

  loadAllRoomsFromAllCinemas() {
    this.loading = true;
    this._cinemaService.getAllCinemas().subscribe({
      next: (cinemas: Cinema[]) => {
        this.allCinemas = cinemas;
        if (!cinemas.length) {
          this.loading = false;
          return;
        }

        const requests = cinemas.map(cinema =>
          this._reviewsService.getRoomsReviewsByCinemaId(cinema.id).pipe()
        );

        forkJoin(requests).subscribe({
          next: (roomsByCinema: TargetTypeReview[][]) => {
            const combined: RoomWithCinema[] = [];

            cinemas.forEach((cinema, index) => {
              const rooms = roomsByCinema[index] || [];
              rooms.forEach(room => {
                combined.push({ 
                  ...(room as RoomWithCinema), 
                  cinemaName: cinema.name,
                  cinemaId: cinema.id
                });
              });
            });

            this.rooms = combined;
            this.applyFilters();
            this.loading = false;
          },
          error: (err) => {
            console.error('Error al cargar reviews:', err);
            this._alertStore.addAlert({ message: 'Error al cargar reseñas', type: 'error' });
            this.loading = false;
          },
        });
      },
      error: (err) => {
        console.error('Error al cargar cines:', err);
        this._alertStore.addAlert({ message: 'Error al cargar cines', type: 'error' });
        this.loading = false;
      },
    });
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  applyFilters() {
    let processedRooms = [...this.rooms];

    const hasStartDateFilter = this.filters.startDate?.trim();
    const hasEndDateFilter = this.filters.endDate?.trim();

    if (hasStartDateFilter || hasEndDateFilter) {
      const start = hasStartDateFilter ? new Date(this.filters.startDate) : null;
      const end = hasEndDateFilter ? new Date(this.filters.endDate) : null;
      
      processedRooms = processedRooms.map(room => {
        const reviewsInRange = room.reviews.filter(review => {
          const createdAt = new Date(review.createdAt);
          
          let passesStart = true;
          if (start) {
            start.setHours(0, 0, 0, 0);
            passesStart = createdAt >= start;
          }

          let passesEnd = true;
          if (end) {
            end.setHours(23, 59, 59, 999);
            passesEnd = createdAt <= end;
          }
          
          return passesStart && passesEnd;
        });
        return { ...room, reviews: reviewsInRange };
      });
    }

    if (this.filters.cinemaId) {
      processedRooms = processedRooms.filter(room => room.cinemaId === this.filters.cinemaId);
    }
    
    processedRooms = processedRooms.filter(room => room.reviews.length > 0);

    const sorted = processedRooms.sort((a, b) => b.reviews.length - a.reviews.length);

    this.filteredRooms = sorted.slice(0, 5);

    if (this.filteredRooms.length === 0 && this.hasActiveFilters()) {
      this._alertStore.addAlert({
        message: 'No se encontraron salas con comentarios para los filtros aplicados.',
        type: 'info'
      });
    }
  }

  clearFilters() {
    this.filters = {
      startDate: '',
      endDate: '',
      cinemaId: ''
    };
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.startDate || this.filters.endDate || this.filters.cinemaId);
  }

  getTotalReviews(): number {
    return this.filteredRooms.reduce((sum, room) => sum + room.reviews.length, 0);
  }

  getTotalRooms(): number {
    return this.filteredRooms.length;
  }

  async exportToPDF() {
    try {
      if (this.filteredRooms.length === 0) {
         this._alertStore.addAlert({
          message: 'No hay datos para exportar. Aplica filtros o carga los datos primero.',
          type: 'warning'
        });
        return;
      }
      
      const columns: ColumnDefinition<any>[] = [
        { header: 'Nombre de Sala', field: 'roomName' },
        { header: 'Cine', field: 'cinemaName' },
        { header: 'Comentarios', field: 'reviewCount' }
      ];

      const dataForPDF = this.filteredRooms.map(room => ({
        roomName: room.name,
        cinemaName: room.cinemaName || 'N/A',
        reviewCount: room.reviews.length
      }));

      const companyInfo: CompanyInfo = {
        companyName: 'Code ‘n Bugs',
        companyAddress: 'Ciudad',
        companyPhoneNumber: '5445 0614'
      };
      
      const footerFields = [
        { label: 'Salas en Reporte', value: this.getTotalRooms(), isCurrency: false },
        { label: 'Total de Comentarios', value: this.getTotalReviews(), isCurrency: false }
      ];

      await generateReportPDF(
        columns,
        dataForPDF,
        companyInfo,
        'Comentarios',
        new Date(), 
        this.session.fullName,
        footerFields
      );

      this._alertStore.addAlert({
        message: "Reporte Exportado Correctamente",
        type: "success"
      });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      this._alertStore.addAlert({
        message: "Error al exportar",
        type: "error"
      });
    }
  }
}
