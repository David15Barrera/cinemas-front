import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MovieService } from 'app/modules/CINEMA_ADMIN/services/movie.service';
import { UploadImgService } from 'app/modules/CINEMA_ADMIN/services/uploadImg.service';
import { Movie, Category, MovieCategory } from 'app/modules/CINEMA_ADMIN/models/movie.interface';
import { ImagePipe } from '@shared/pipes/image.pipe';
import { forkJoin, switchMap, of, take, finalize } from 'rxjs';

interface MovieForm extends Partial<Movie> {
  selectedCategories?: string[];
}

@Component({
  selector: 'app-movies-detail',
  standalone: true, // Asumimos que es standalone
  imports: [FormsModule, CommonModule, ImagePipe],
  templateUrl: './movies-detail.component.html',
  styleUrl: './movies-detail.component.css'
})
export class MoviesDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private movieService = inject(MovieService);
  private uploadImgService = inject(UploadImgService);

  movieId: string = '';
  movieData: MovieForm = { active: true, selectedCategories: [] };
  allCategories: Category[] = [];
  currentMovieCategories: MovieCategory[] = [];
  
  selectedFile?: File;
  isLoading = true;
  isSaving = false;

  ngOnInit(): void {
    this.route.params.pipe(
      take(1),
      switchMap(params => {
        this.movieId = params['id'];
        if (!this.movieId) {
          alert('ID de película no proporcionado.');
          this.router.navigate(['/admin/movies']);
          return of(null);
        }
        return forkJoin({
          movie: this.movieService.getMovieById(this.movieId),
          allCategories: this.movieService.getAllCategories(),
          allAssignments: this.movieService.getAllMovieCategory()
        }).pipe(
          finalize(() => this.isLoading = false) 
        );
      }),
    ).subscribe({
      next: data => {
        if (data) {
          this.allCategories = data.allCategories;
          this.currentMovieCategories = data.allAssignments.filter(mc => mc.movieId === this.movieId);

          this.movieData = { 
            ...data.movie, 
            selectedCategories: this.currentMovieCategories.map(mc => mc.categoryId)
          };
        }
      },
      error: error => {
        console.error('Error al cargar datos:', error);
        alert('Error al cargar los detalles de la película. Ver consola para más detalles.');
        this.router.navigate(['/admin/movies']);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.isSaving = true;

      this.uploadImgService.saveImg(formData).pipe(
        finalize(() => this.isSaving = false)
      ).subscribe({
        next: (res: any) => {
            this.movieData.posterUrl = res.image; 
            alert('Imagen subida temporalmente.');
        },
        error: err => {
          console.error('Error al subir imagen', err);
          alert('Error al subir imagen. Inténtelo de nuevo.');
        }
      });
    }
  }

saveMovie(): void {
    if (!this.movieId) { return; }
    this.isSaving = true;

    const duration = this.movieData.durationMinutes ?? 0; 
    const active = this.movieData.active ?? false; 

    const moviePayload: Partial<Movie> = {
        title: this.movieData.title,
        director: this.movieData.director,
        durationMinutes: duration, 
        synopsis: this.movieData.synopsis,
        classification: this.movieData.classification,
        releaseDate: this.movieData.releaseDate,
        posterUrl: this.movieData.posterUrl,
        active: active, 
    };

    const categoriesToAssign = this.movieData.selectedCategories || [];
    
    const oldIds = this.currentMovieCategories.map(mc => mc.categoryId);
    const newIds = categoriesToAssign;

    const idsToDelete = oldIds.filter(id => !newIds.includes(id));
    const idsToCreate = newIds.filter(id => !oldIds.includes(id));

    const deleteOps = this.currentMovieCategories
      .filter(mc => idsToDelete.includes(mc.categoryId))
      .map(mc => this.movieService.deleteMovieCategory(mc.id!));

    const createOps = idsToCreate.map(catId => {
      const mc: MovieCategory = { movieId: this.movieId, categoryId: catId } as MovieCategory;
      return this.movieService.createMovieCategory(mc);
    });

    const assignmentOps = [...deleteOps, ...createOps];
    const opsToWait = assignmentOps.length > 0 ? assignmentOps : [of(null)]; 

    forkJoin(opsToWait).pipe(
        switchMap(() => this.movieService.updateMovie(this.movieId, moviePayload as Movie)), 
        finalize(() => this.isSaving = false) 
    ).subscribe({
        next: () => {
            alert('Película y categorías actualizadas correctamente.');
            this.goBack();
        },
        error: err => {
            console.error('Error al actualizar la película:', err);
            alert('Error al actualizar. Verifique la consola (Error: ' + (err.error?.message || '500 Internal') + ').');
        }
    });
}
  deleteMovie(): void {
    if (!this.movieId) { return; }
    if (!confirm('ADVERTENCIA: ¿Está seguro que desea eliminar PERMANENTEMENTE esta película y todas sus asignaciones?')) {
        return;
    }
    this.isSaving = true;

    const deleteAssignmentOps = this.currentMovieCategories
        .filter(mc => mc.id)
        .map(mc => this.movieService.deleteMovieCategory(mc.id!));

    forkJoin(deleteAssignmentOps).pipe(
        switchMap(() => this.movieService.deleteMovie(this.movieId)),
        finalize(() => this.isSaving = false) 
    ).subscribe({
        next: () => {
            alert('Película eliminada correctamente.');
            this.goBack();
        },
        error: err => {
            console.error('Error al eliminar:', err);
            alert('Error al eliminar. Verifique la consola.');
        }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/movies-admin']);
  }
}