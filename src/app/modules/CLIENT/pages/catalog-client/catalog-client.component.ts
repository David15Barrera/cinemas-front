import { Component, inject, OnInit } from '@angular/core';
import { Cinema } from 'app/modules/CINEMA_ADMIN/models/cinema.interface';
import { CinemaService } from 'app/modules/CINEMA_ADMIN/services/cinema.service';
import { AlertStore } from 'app/store/alert.store';
import { LucideAngularModule, Tag, Calendar, MapPin, AlertCircle } from 'lucide-angular';
import { ImagePipe } from '@shared/pipes/image.pipe';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-catalog-client',
  standalone: true,
  imports: [LucideAngularModule, ImagePipe, DatePipe, FormsModule, CommonModule],
  templateUrl: './catalog-client.component.html',
  styleUrl: './catalog-client.component.css'
})
export class CatalogClientComponent implements OnInit {

  private readonly _cinemaService = inject(CinemaService);
  private readonly _alertStore = inject(AlertStore);
  private readonly _router = inject(Router)
  private readonly _activeRoute = inject(ActivatedRoute)

  cinemas: Cinema[] = [];
  filteredCinemas: Cinema[] = [];
  searchName: string = '';

  Tag = Tag;
  Calendar = Calendar;
  MapPin = MapPin;
  AlertCircle = AlertCircle;

  constructor() {}

  ngOnInit(): void {
    this.loadCinemas();
  }

  loadCinemas() {
    this._cinemaService.getAllCinemas().subscribe({
      next: (response) => {
        this.cinemas = response;
        this.filteredCinemas = [...this.cinemas];
        this._alertStore.addAlert({
          message: 'Cines cargados correctamente.',
          type: 'success',
        });
      },
      error: (err) => {
        this._alertStore.addAlert({
          message: 'Error al cargar los cines.',
          type: 'error'
        });
        console.error(err);
      }
    });
  }

filterByName() {
    const name = this.searchName.trim().toLowerCase();
    if (!name) {
      this.filteredCinemas = [...this.cinemas];
    } else {
      this.filteredCinemas = this.cinemas.filter(cinema =>
        cinema.name.toLowerCase().includes(name)
      );
    }
  }

  viewCinemaFunctions(cinema: Cinema) {
    console.log(cinema.id)
    this._router.navigate(['/client/showtimes', cinema.id]);
  }

}
