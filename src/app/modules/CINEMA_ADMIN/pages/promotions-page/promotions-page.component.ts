import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { LocalStorageService } from '@shared/services/local-storage.service';
import {
  Edit,
  Eye,
  Filter,
  LucideAngularModule,
  Plus,
  PlusCircle,
  Trash2,
} from 'lucide-angular';
import { CinemaService } from '../../services/cinema.service';
import { RoomService } from '../../services/Room.service';
import { Room } from '../../models/room.interface';
import { Promotion } from '../../models/promotion.interface';
import { Session } from 'app/modules/session/models/auth';
import { Customer } from '@shared/models/customer.interface';
import { PromotionService } from '../../services/promotion.service';
import { UserService } from '@shared/services/user.service';
import FormPromotionComponent from '../../components/form-promotion/form-promotion.component';
import { CommonModule } from '@angular/common';
import { Movie } from '../../models/movie.interface';
import { MovieService } from '../../services/movie.service';
import { AlertStore } from 'app/store/alert.store';
import { HandlerError } from '@shared/utils/handlerError';

@Component({
  selector: 'app-promotions-page',
  imports: [CommonModule, LucideAngularModule, FormPromotionComponent],
  templateUrl: './promotions-page.component.html',
})
export class PromotionsPageComponent {
  // iconos
  readonly PlusCircle = PlusCircle;
  readonly Filter = Filter;
  readonly Edit = Edit;
  readonly Plus = Plus;
  readonly Eye = Eye;
  readonly Trash2 = Trash2;

  // modal
  @ViewChild('modalFormPromotion')
  modalFormPromotion!: ElementRef<HTMLDialogElement>;
  @ViewChild('deleteModal') deleteModal!: ElementRef<HTMLDialogElement>;

  // injeccion de servicios
  private readonly localStorageService = inject(LocalStorageService);
  private readonly cinemaService = inject(CinemaService);
  private readonly roomService = inject(RoomService);
  private readonly promotionService = inject(PromotionService);
  private readonly movieService = inject(MovieService);
  private readonly userService = inject(UserService);
  private readonly alertStore = inject(AlertStore);
  private HandlerError = HandlerError;

  // datos
  promotions = signal<Promotion[]>([]);
  promotionUpdate = signal<Promotion | null>(null);
  session: Session = this.localStorageService.getState().session;
  cinemaId = signal<string>('');
  targetId = signal<string>('');

  //catalogos
  rooms = signal<Room[]>([]);
  movies = signal<Movie[]>([]);
  customers = signal<Customer[]>([]);

  ngOnInit() {
    this.loadCinema();
    this.getAllCustomers();
    this.getAllMoviesActive();
  }

  eventOnSaveSucces() {
    this.getPromotionsByCinemaId(this.cinemaId());
  }

  openModalFormPromotion(promotionUpdate: Promotion | null = null) {
    this.promotionUpdate.set(promotionUpdate);
    this.modalFormPromotion.nativeElement.showModal();
  }

  closeModalFormPromotion() {
    this.promotionUpdate.set(null);
    this.modalFormPromotion.nativeElement.close();
  }

  getAllCustomers() {
    this.userService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers.set(customers);
      },
      error: (err) => {
        this.customers.set([]);
        console.error('Error al obtener los clientes:', err);
      },
    });
  }

  getPromotionsByCinemaId(cinemaId: string) {
    this.promotionService.getPromotionsByCinemaId(cinemaId).subscribe({
      next: (promotions) => {
        this.promotions.set(promotions);
      },
      error: (err) => {
        this.promotions.set([]);
        console.error('Error al obtener las promociones:', err);
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

  getAllMoviesActive() {
    this.movieService.getAllMoviesActive().subscribe({
      next: (movies) => {
        this.movies.set(movies);
      },
      error: (err) => {
        this.movies.set([]);
        console.error('Error al obtener las películas:', err);
      },
    });
  }

  loadCinema() {
    this.cinemaService.getCinemaByAdminUserId(this.session.id).subscribe({
      next: (cinema) => {
        if (cinema) {
          this.cinemaId.set(cinema.id);
          this.getRoomsByCinemaId(cinema.id);
          this.getPromotionsByCinemaId(cinema.id);
        }
      },
    });
  }

  getActivePromotionsCount(): number {
    return this.promotions().filter((p) => p.isActive).length;
  }

  closeDeleteModal() {
    this.deleteModal.nativeElement.close();
  }

  openModalDelete(promotionId: string) {
    this.targetId.set(promotionId);
    this.deleteModal.nativeElement.showModal();
  }

  deletePromotionModal() {
    this.deletePromotion(this.targetId());
  }

  deletePromotion(promotionId: string) {
    this.promotionService.deletePromotion(promotionId).subscribe({
      next: () => {
        this.alertStore.addAlert({
          message: 'Promoción eliminada correctamente.',
          type: 'warning',
        });
        this.getPromotionsByCinemaId(this.cinemaId());
      },
      error: (err) => {
        const msgDefault = 'Error al eliminar la promoción.';
        this.HandlerError.handleError(err, this.alertStore, msgDefault);
        console.error('Error al eliminar la promoción:', err);
      },
    });
  }
}
