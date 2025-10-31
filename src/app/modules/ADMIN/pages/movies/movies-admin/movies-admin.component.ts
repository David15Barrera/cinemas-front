import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router
import { MovieService } from 'app/modules/CINEMA_ADMIN/services/movie.service';
import { Movie, Category, MovieCategory } from 'app/modules/CINEMA_ADMIN/models/movie.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UploadImgService } from 'app/modules/CINEMA_ADMIN/services/uploadImg.service';
import { ImagePipe } from '@shared/pipes/image.pipe';
import { forkJoin, map, switchMap, Observable } from 'rxjs';

// Interfaz extendida para la tabla
interface MovieExtended extends Movie {
  categoryNames: string[];
}

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
 activeTab: 'movies' | 'categories' = 'movies';
  
  moviesWithCategories: MovieExtended[] = [];
  movies: Movie[] = [];
  categories: Category[] = [];
  movieCategories: MovieCategory[] = [];
 
  selectedFile?: File;
    newMovies: NewMovieForm = {
      selectedCategories: [] 
    };
  showMovieModal = false;
  showCategoryModal = false;

  newMovie: NewMovieForm = {
      active: true,
      selectedCategories: []
  };

  newCategory: Partial<Category> = {};

  constructor(
    private movieService: MovieService, 
    private uploadImgService: UploadImgService,
    private router: Router
    ) {}

  ngOnInit(): void {
    forkJoin({
      movies: this.movieService.getAllMovies(),
      categories: this.movieService.getAllCategories(),
      movieCategories: this.movieService.getAllMovieCategory()
    }).subscribe(({ movies, categories, movieCategories }) => {
      this.movies = movies;
      this.categories = categories;
      this.movieCategories = movieCategories;
      this.buildMovieTableData();
    });
  }

  private buildMovieTableData(): void {
    this.moviesWithCategories = this.movies.map(movie => {
      const assignedCategoryIds = this.movieCategories
        .filter(mc => mc.movieId === movie.id)
        .map(mc => mc.categoryId);
      
      const categoryNames = this.categories
        .filter(cat => assignedCategoryIds.includes(cat.id))
        .map(cat => cat.name);

      return {
        ...movie,
        categoryNames: categoryNames
      } as MovieExtended;
    });
  }

  loadMovies() {
    forkJoin({
      movies: this.movieService.getAllMovies(),
      categories: this.movieService.getAllCategories(),
      movieCategories: this.movieService.getAllMovieCategory()
    }).subscribe(({ movies, categories, movieCategories }) => {
      this.movies = movies;
      this.categories = categories;
      this.movieCategories = movieCategories;
      this.buildMovieTableData();
    });
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
    if (!this.newMovie.title || !this.newMovie.director || !this.newMovie.releaseDate) {
        alert('Por favor, complete los campos requeridos.');
        return;
    }
    
    const moviePayload: Partial<Movie> = { ...this.newMovie };
    const categoriesToAssign = this.newMovie.selectedCategories || [];
    delete moviePayload.categories;

    this.movieService.createMovie(moviePayload as Movie).subscribe((createdMovie) => {
      
      const assignmentObservables: Observable<any>[] = categoriesToAssign.map(catId => {
        const mc: MovieCategory = { movieId: createdMovie.id, categoryId: catId } as MovieCategory;
        return this.movieService.createMovieCategory(mc);
      });

      if (assignmentObservables.length > 0) {
          forkJoin(assignmentObservables).subscribe({
              next: () => {
                  this.loadMovies();
                  this.resetMovieForm();
              },
              error: err => console.error('Error al asignar categorías:', err)
          });
      } else {
          this.loadMovies();
          this.resetMovieForm();
      }
    });
  }
  
  private resetMovieForm(): void {
    this.newMovie = { active: true, selectedCategories: [] };
    this.showMovieModal = false;
  }

  deleteMovie(id: string) {
    if (!confirm('¿Seguro que deseas eliminar esta película? Esto eliminará también todas sus asignaciones de categorías.')) {
        return;
    }

    const assignmentsToDelete = this.movieCategories.filter(mc => mc.movieId === id);
    
    const deleteAssignments$ = assignmentsToDelete
        .filter(mc => mc.id)
        .map(mc => this.movieService.deleteMovieCategory(mc.id!));
    
    forkJoin(deleteAssignments$).pipe(
        switchMap(() => this.movieService.deleteMovie(id))
    ).subscribe({
        next: () => {
            this.loadMovies();
            alert('Película eliminada correctamente.');
        },
        error: err => console.error('Error durante la eliminación en cascada:', err)
    });
  }

  editMovie(movieId: string): void {
    this.router.navigate(['/admin/movie-detail', movieId]);
  }

  reviewsMovie(movieId: string): void{
    this.router.navigate(['/admin/reviews-movie', movieId])
  }
  // --- Categorías ---
  loadCategories() {
    this.movieService.getAllCategories().subscribe(data => {
      this.categories = data;
      this.buildMovieTableData();
    });
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

}
