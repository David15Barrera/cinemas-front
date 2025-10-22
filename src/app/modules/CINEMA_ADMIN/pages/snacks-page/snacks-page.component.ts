import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import {
  Popcorn,
  Plus,
  Filter,
  RotateCcw,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Eye,
  Edit,
  Ban,
  Coffee,
  Package,
  Sandwich,
  LucideAngularModule,
} from 'lucide-angular';
import { FormSnackModal } from '../../components/form-snack-modal/form-snack-modal.component';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Session } from 'app/modules/session/models/auth';
import { Snack } from '../../models/snack.interface';
import { CinemaService } from '../../services/cinema.service';
import { SnackService } from '../../services/snack.service';

@Component({
  selector: 'app-snacks-page',
  imports: [LucideAngularModule, FormSnackModal],
  templateUrl: './snacks-page.component.html',
})
export class SnacksPageComponent {
  // Iconos de lucide-angular
  readonly Popcorn = Popcorn;
  readonly Plus = Plus;
  readonly Filter = Filter;
  readonly RotateCcw = RotateCcw;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly DollarSign = DollarSign;
  readonly TrendingDown = TrendingDown;
  readonly TrendingUp = TrendingUp;
  readonly Eye = Eye;
  readonly Edit = Edit;
  readonly Ban = Ban;
  readonly Coffee = Coffee;
  readonly Package = Package;
  readonly Sandwich = Sandwich;

  // modal
  @ViewChild('modalFormSnack')
  modalFormSnack!: ElementRef<HTMLDialogElement>;

  // injección de servicios
  private readonly localStorageService = inject(LocalStorageService);
  private readonly snackService = inject(SnackService);
  private readonly cinemaService = inject(CinemaService);

  // datos
  snacks = signal<Snack[]>([]);
  snackUpdate = signal<Snack | null>(null);
  session: Session = this.localStorageService.getState().session;

  ngOnInit(): void {
    this.loadCinema();
  }

  loadCinema() {
    this.cinemaService.getCinemaByAdminUserId(this.session.id).subscribe({
      next: (cinema) => {
        if (cinema) this.loadSnacks(cinema.id);
      },
    });
  }

  eventOnSaveSucces() {
    this.loadCinema();
  }

  openModalFormSnack(snackUpdate: Snack | null = null) {
    this.snackUpdate.set(snackUpdate);
    this.modalFormSnack.nativeElement.showModal();
  }

  closeModalFormSnack() {
    this.snackUpdate.set(null);
    this.modalFormSnack.nativeElement.close();
  }

  loadSnacks(cinemaId: string) {
    this.snackService.getSnacksByCinemaId(cinemaId).subscribe({
      next: (snacks) => {
        this.snacks.set(snacks);
      },
      error: (error) => {
        console.error('Error loading snacks:', error);
      },
    });
  }
}
