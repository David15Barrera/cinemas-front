import { Component, inject, OnInit } from '@angular/core';
import { MovieService } from 'app/modules/CINEMA_ADMIN/services/movie.service';
import { Movie, Category, MovieCategory } from 'app/modules/CINEMA_ADMIN/models/movie.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UploadImgService } from 'app/modules/CINEMA_ADMIN/services/uploadImg.service';
import { ImagePipe } from '@shared/pipes/image.pipe';

interface NewMovieForm extends Partial<Movie> {
  selectedCategories?: string[];
}

@Component({
  selector: 'app-movies-admin',
  imports: [FormsModule, CommonModule, ImagePipe],
  templateUrl: './movies-admin.component.html',
  styleUrl: './movies-admin.component.css'
})
export class MoviesAdminComponent implements OnInit{
  activeTab: 'movies' | 'categories' | 'assign' = 'movies';

  movies: Movie[] = [];
  categories: Category[] = [];
  movieCategories: MovieCategory[] = [];
  selectedFile?: File;
  newMovies: NewMovieForm = {};
  showMovieModal = false;
  showCategoryModal = false;
  showAssignModal = false;

  newMovie: Partial<Movie> = {};
  newCategory: Partial<Category> = {};
  assignData: Partial<MovieCategory> = {};

  constructor(private movieService: MovieService, private uploadImgService: UploadImgService) {}

  ngOnInit(): void {
    this.loadMovies();
    this.loadCategories();
    this.loadMovieCategories();
  }

  loadMovies() {
    this.movieService.getAllMovies().subscribe(data => (this.movies = data));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const formData = new FormData();
      formData.append('file', this.selectedFile);

    this.uploadImgService.saveImg(formData).subscribe({
        next: (res: any) => {
            this.newMovie.posterUrl = res.image; 
            console.log('Imagen subida:', res.image);
        },
        error: err => console.error('Error al subir imagen', err)
    });
    }
  }



 createMovie() {
    if (!this.newMovies.selectedCategories) this.newMovies.selectedCategories = [];

    this.movieService.createMovie(this.newMovie as Movie).subscribe((createdMovie) => {
      const assignments = this.newMovies.selectedCategories!.map(catId => ({
        movieId: createdMovie.id,
        categoryId: catId
      }));
      assignments.forEach(mc => {
        this.movieService.createMovieCategory(mc as MovieCategory).subscribe();
      });
      this.loadMovies();
      this.loadMovieCategories();
      this.newMovie = {};
      this.showMovieModal = false;
    });
  }

  deleteMovie(id: string) {
    this.movieService.deleteMovie(id).subscribe(() => this.loadMovies());
  }

  // --- Categorías ---
  loadCategories() {
    this.movieService.getAllCategories().subscribe(data => (this.categories = data));
  }

  createCategory() {
    this.movieService.createCategory(this.newCategory as Category).subscribe(() => {
      this.loadCategories();
      this.newCategory = {};
      this.showCategoryModal = false;
    });
  }

  deleteCategory(id: string) {
    this.movieService.deleteCategory(id).subscribe(() => this.loadCategories());
  }

  // --- Asignación de categorías ---
  loadMovieCategories() {
    this.movieService.getAllMovieCategory().subscribe(data => (this.movieCategories = data));
  }

  assignCategory() {
    this.movieService.createMovieCategory(this.assignData as MovieCategory).subscribe(() => {
      this.loadMovieCategories();
      this.assignData = {};
      this.showAssignModal = false;
    });
  }

  deleteAssignment(id: string) {
    this.movieService.deleteMovieCategory(id).subscribe(() => this.loadMovieCategories());
  }

  getMovieName(movieId: string): string {
  const movie = this.movies.find(m => m.id === movieId);
  return movie ? movie.title : 'Desconocido';
}

getCategoryName(categoryId: string): string {
  const category = this.categories.find(c => c.id === categoryId);
  return category ? category.name : 'Desconocido';
}
}
