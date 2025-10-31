import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '@shared/services/api-config.service';
import { Category, Movie, MovieCategory } from '../models/movie.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly _http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly API_MOVIES = this.apiConfig.API_MOVIES;
  private readonly API_CATEGORIES = this.apiConfig.API_CATEGORIES;
  private readonly API_MOVIE_CATEGORIES = this.apiConfig.API_MOVIES_CATEGORY;

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

   createMovie(movie: Movie): Observable<Movie> {
    return this._http.post<Movie>(this.API_MOVIES, movie);
  }

  updateMovie(id: string, movie: Movie): Observable<Movie> {
    return this._http.put<Movie>(`${this.API_MOVIES}/${id}`, movie);
  }

  deleteMovie(id: string): Observable<void>{
    return this._http.delete<void>(`${this.API_MOVIES}/${id}`);
  }

  //Categorias

  createCategory(categorias: Category): Observable<Category>{
    return this._http.post<Category>(this.API_CATEGORIES, categorias)
  }  

  updateCategory(id:string, categorias: Category): Observable<Category>{
    return this._http.put<Category>(`${this.API_CATEGORIES}/${id}`, categorias);
  }

  deleteCategory(id:string): Observable<void>{
    return this._http.delete<void>(`${this.API_CATEGORIES}/${id}`);
  }

  getCategoryByid(id:string): Observable<Category>{
    return this._http.get<Category>(`${this.API_CATEGORIES}/${id}`)
  }

  //Movie-categorias

  createMovieCategory(moviecategory: MovieCategory): Observable<MovieCategory>{
    return this._http.post<MovieCategory>(this.API_MOVIE_CATEGORIES, moviecategory);
  }

  updateMovieCategory(id:string, moviecategory: MovieCategory): Observable<MovieCategory>{
    return this._http.put<MovieCategory>(`${this.API_MOVIE_CATEGORIES}/${id}`, moviecategory);
  }

  deleteMovieCategory(id:string): Observable<void>{
    return this._http.delete<void>(`${this.API_MOVIE_CATEGORIES}/${id}`);
  }

  getAllMovieCategory(): Observable<MovieCategory[]>{
    return this._http.get<MovieCategory[]>(`${this.API_MOVIE_CATEGORIES}`);
  }

  getMovieCategoryById(id:string): Observable<MovieCategory>{
    return this._http.get<MovieCategory>(`${this.API_MOVIE_CATEGORIES}/${id}`);
  }

  uploadImage(fileData: FormData): Observable<any> {
  return this._http.post<any>(this.apiConfig.API_UPLOAD, fileData);
}

  getMovieById(id:string): Observable<Movie>{
    return this._http.get<Movie>(`${this.API_MOVIES}/${id}`)
  }
}
