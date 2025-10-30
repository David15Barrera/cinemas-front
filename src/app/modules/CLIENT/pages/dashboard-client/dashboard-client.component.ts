import { Component, inject, OnInit } from '@angular/core';
import { HandlerError } from '@shared/utils/handlerError';
import { Cinema } from 'app/modules/CINEMA_ADMIN/models/cinema.interface';
import { Movie } from 'app/modules/CINEMA_ADMIN/models/movie.interface';
import { Snack } from 'app/modules/CINEMA_ADMIN/models/snack.interface';
import { CinemaService } from 'app/modules/CINEMA_ADMIN/services/cinema.service';
import { MovieService } from 'app/modules/CINEMA_ADMIN/services/movie.service';
import { SnackService } from 'app/modules/CINEMA_ADMIN/services/snack.service';
import { AlertStore } from 'app/store/alert.store';

@Component({
  selector: 'app-dashboard-client',
  imports: [],
  templateUrl: './dashboard-client.component.html',
  styleUrl: './dashboard-client.component.css'
})
export class DashboardClientComponent implements OnInit {

  private readonly _snaksService = inject(SnackService)
  private readonly _movieService = inject(MovieService)
  private readonly _cinemaService = inject(CinemaService)
  private readonly _alertStore = inject(AlertStore)
  private HandlerError = HandlerError;

  snacks:Snack[] = []
  movies:Movie[] = []
  cinemas:Cinema[] = []

  ngOnInit(): void {
    this.loadSnacks();
    this.loadMovies();
    this.loadCinema();
  }

  loadSnacks(){
    this._snaksService.getSnacks().subscribe({
      next: (response) =>{
        this.snacks = response
        console.log("Snacks", this.snacks)
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
        console.log("Movies", this.movies)
      },
      error: (err) =>{
        const msgDefault = `Error al obtener las peliculas.`;
        this.HandlerError.handleError(err, this._alertStore, msgDefault);
      }
    })
  }

  loadCinema(){
    this._cinemaService.getAllCinemas().subscribe({
      next: (response) =>{
        this.cinemas = response
        console.log("Cinemas", this.cinemas)
      },
      error: (err) =>{
        const msgDefault = `Error al obtener los cines.`;
        this.HandlerError.handleError(err, this._alertStore, msgDefault);
      }
    })
  }
  

}
