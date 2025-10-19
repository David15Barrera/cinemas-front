import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { RoomService } from '../../services/Room.service';
import { Room } from '../../models/room.interface';
import { Category, Classification, Movie } from '../../models/movie.interface';
import { CinemaService } from '../../services/cinema.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Session } from 'app/modules/session/models/auth';
import { ImagePipe } from '@shared/pipes/image.pipe';
import { FormsModule } from '@angular/forms';
import { FilterCategoryPipe } from '../../pipes/filterCategory.pipe';
import { FilterClassificationPipe } from '../../pipes/filterClassification.pipe';
import { FilterMovieTitlePipe } from '../../pipes/filterMovieTitle.pipe';
import { FormShowtimesModalComponent } from '../../components/form-showtimes-modal/form-showtimes-modal.component';

@Component({
  selector: 'app-schedules-page',
  imports: [
    ImagePipe,
    FormsModule,
    FilterCategoryPipe,
    FilterClassificationPipe,
    FilterMovieTitlePipe,
    FormShowtimesModalComponent,
  ],
  templateUrl: './schedules-page.component.html',
})
export class SchedulesPageComponent {
  // referencias modales
  @ViewChild('modalCreateShowtime')
  modalCreateShowtime!: ElementRef<HTMLDialogElement>;
  // injeccion de servicios
  private readonly movieService = inject(MovieService);
  private readonly roomService = inject(RoomService);
  private readonly cinemaService = inject(CinemaService);
  private readonly localStorageService = inject(LocalStorageService);

  //data
  rooms = signal<Room[]>([]);
  movies = signal<Movie[]>([]);
  movie = signal<Movie | null>(null);
  categories = signal<Category[]>([]);
  classifications = signal<Classification[]>([]);
  session: Session = this.localStorageService.getState().session;

  //filtros
  filterClassification = signal<string>('');
  filterMovieTitle = signal<string>('');
  filterCategory = signal<string>('');

  ngOnInit(): void {
    this.loadClassifications();
    this.loadMovies();
    this.loadRooms();
    this.loadCategories();
  }

  loadMovies() {
    this.movieService.getAllMoviesActive().subscribe({
      next: (movies) => {
        this.movies.set(movies);
      },
      error: (error) => {
        this.movies.set([]);
        console.error('Error loading movies:', error);
      },
    });
  }

  loadCategories() {
    this.movieService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (error) => {
        this.categories.set([]);
        console.error('Error loading categories:', error);
      },
    });
  }

  getRoomsByCinemaId(cinemaId: string) {
    this.roomService.getRoomsByCinemaId(cinemaId).subscribe({
      next: (rooms) => {
        this.rooms.set(rooms);
      },
      error: (err) => {
        this.rooms.set([]);
        console.error('Error al obtener el cine:', err);
      },
    });
  }

  loadRooms() {
    this.cinemaService.getCinemaByAdminUserId(this.session.id).subscribe({
      next: (cinema) => {
        if (cinema) this.getRoomsByCinemaId(cinema.id);
      },
    });
  }

  loadClassifications() {
    this.classifications.set([
      { name: 'A', description: 'Apta para todo público' },
      { name: 'B', description: 'No recomendada para menores de 12 años' },
      { name: 'B15', description: 'No recomendada para menores de 15 años' },
      { name: 'C', description: 'No recomendada para menores de 18 años' },
      { name: 'D', description: 'Exclusiva para adultos' },
    ]);
  }

  clearFiltersMovies() {
    this.filterClassification.set('');
    this.filterMovieTitle.set('');
    this.filterCategory.set('');
  }

  openModalCreateShowtime(movie: Movie) {
    this.movie.set(movie);
    this.modalCreateShowtime.nativeElement.show();
  }

  closeModalShowtimes(){
    this.modalCreateShowtime.nativeElement.close();
  }
}
