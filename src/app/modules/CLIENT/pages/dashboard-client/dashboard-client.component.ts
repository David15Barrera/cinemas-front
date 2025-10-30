import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Building, Film, Popcorn, MapPin, Clock, Shield, DollarSign, AlertCircle } from 'lucide-angular';
import { HandlerError } from '@shared/utils/handlerError';
import { Cinema } from 'app/modules/CINEMA_ADMIN/models/cinema.interface';
import { Movie } from 'app/modules/CINEMA_ADMIN/models/movie.interface';
import { Snack } from 'app/modules/CINEMA_ADMIN/models/snack.interface';
import { CinemaService } from 'app/modules/CINEMA_ADMIN/services/cinema.service';
import { MovieService } from 'app/modules/CINEMA_ADMIN/services/movie.service';
import { SnackService } from 'app/modules/CINEMA_ADMIN/services/snack.service';
import { AlertStore } from 'app/store/alert.store';
import { ImagePipe } from '@shared/pipes/image.pipe';

@Component({
  selector: 'app-dashboard-client',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    ImagePipe
  ],
  templateUrl: './dashboard-client.component.html',
  styleUrl: './dashboard-client.component.css'
})
export class DashboardClientComponent implements OnInit {

  private readonly _snaksService = inject(SnackService)
  private readonly _movieService = inject(MovieService)
  private readonly _cinemaService = inject(CinemaService)
  private readonly _alertStore = inject(AlertStore)
  private readonly _router = inject(Router)
  private HandlerError = HandlerError;

  readonly Building = Building;
  readonly Film = Film;
  readonly Popcorn = Popcorn;
  readonly MapPin = MapPin;
  readonly Clock = Clock;
  readonly Shield = Shield;
  readonly DollarSign = DollarSign;
  readonly AlertCircle = AlertCircle;

  snacks: Snack[] = []
  movies: Movie[] = []
  cinemas: Cinema[] = []

  ngOnInit(): void {
    this.loadSnacks();
    this.loadMovies();
    this.loadCinema();
  }

  loadSnacks(){
    this._snaksService.getSnacks().subscribe({
      next: (response) =>{
        this.snacks = response
      },
      error: (err) =>{
        const msgDefault = `Error al obtener los snacks.`;
        this.HandlerError.handleError(err, this._alertStore, msgDefault);
      }
    })
  }

  loadMovies(){
    this._movieService.getAllMovies().subscribe({
      next: (response) => {
        this.movies = response
      },
      error: (err) =>{
        const msgDefault = `Error al obtener las películas.`;
        this.HandlerError.handleError(err, this._alertStore, msgDefault);
      }
    })
  }

  loadCinema(){
    this._cinemaService.getAllCinemas().subscribe({
      next: (response) =>{
        this.cinemas = response
      },
      error: (err) =>{
        const msgDefault = `Error al obtener los cines.`;
        this.HandlerError.handleError(err, this._alertStore, msgDefault);
      }
    })
  }

  viewReview(target: Cinema | Movie | Snack, type: 'cinema' | 'movie' | 'snack'){
    
    this._router.navigate(['/client/review', target.id], {
      state: { 
        data: target,
        type: type
      }
    });
  }
}