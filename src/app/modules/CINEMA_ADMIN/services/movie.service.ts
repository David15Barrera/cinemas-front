import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '@shared/services/api-config.service';
import { Category, Movie } from '../models/movie.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly _http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly API_MOVIES = this.apiConfig.API_MOVIES;
  private readonly API_CATEGORIES = this.apiConfig.API_CATEGORIES;

  constructor() {}

  getAllMoviesActive(): Observable<Movie[]> {
    return this._http.get<Movie[]>(`${this.API_MOVIES}/is-active`);
  }

  getAllMovies(): Observable<Movie[]> {
    return this._http.get<Movie[]>(this.API_MOVIES);
  }

  getAllCategories(): Observable<Category[]> {
    return this._http.get<Category[]>(this.API_CATEGORIES);
  }

  getMovieById(id:string): Observable<Movie>{
    return this._http.get<Movie>(`${this.API_MOVIES}/${id}`)
  }
}
