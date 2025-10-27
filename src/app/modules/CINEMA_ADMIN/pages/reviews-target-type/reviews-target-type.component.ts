import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { RoomService } from '../../services/Room.service';
import { AlertStore } from 'app/store/alert.store';
import { CinemaService } from '../../services/cinema.service';
import { ReviewsService } from '../../services/reviews.service';
import { Room } from '../../models/room.interface';
import { Snack } from '../../models/snack.interface';
import { ActivatedRoute } from '@angular/router';
import { SnackService } from '../../services/snack.service';
import { HandlerError } from '@shared/utils/handlerError';
import { Review } from '../../models/review.interface';
import { CommonModule } from '@angular/common';
import { ImagePipe } from '@shared/pipes/image.pipe';
import {
  ArrowLeft,
  MessageSquare,
  DoorOpen,
  Popcorn,
  Star,
  Users,
  Grid3x3,
  DollarSign,
  Package,
  Filter,
  User,
  Calendar,
  MessageCircle,
  Info,
  Trash2,
  BarChart3,
  LucideAngularModule,
} from 'lucide-angular';

@Component({
  selector: 'app-reviews-target-type',
  imports: [CommonModule, LucideAngularModule, ImagePipe],
  templateUrl: './reviews-target-type.component.html',
})
export class ReviewsTargetTypeComponent {
  // Lucide icons
  readonly ArrowLeft = ArrowLeft;
  readonly MessageSquare = MessageSquare;
  readonly DoorOpen = DoorOpen;
  readonly Popcorn = Popcorn;
  readonly Star = Star;
  readonly Users = Users;
  readonly Grid3x3 = Grid3x3;
  readonly DollarSign = DollarSign;
  readonly Package = Package;
  readonly Filter = Filter;
  readonly User = User;
  readonly Calendar = Calendar;
  readonly MessageCircle = MessageCircle;
  readonly Info = Info;
  readonly Trash2 = Trash2;
  readonly BarChart3 = BarChart3;

  // modal
  @ViewChild('deleteModal') deleteModal!: ElementRef<HTMLDialogElement>;

  // injecion de dependencias
  private readonly roomService = inject(RoomService);
  private readonly alertStore = inject(AlertStore);
  private readonly cinemaService = inject(CinemaService);
  private readonly reviewService = inject(ReviewsService);
  private readonly route = inject(ActivatedRoute);
  private readonly snackService = inject(SnackService);

  private HandlerError = HandlerError;

  //input url signal
  targetId = signal<string>('');
  targetType = signal<'room' | 'snack'>('room'); // aca se puede agregar otro tipo de target si es necesario
  target = signal<Room | Snack | null>(null);

  // reviews
  reviews = signal<Review[]>([]);
  deleteReviewId = signal<string>('');

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.targetId.set(params.get('id')!);
      const type = params.get('type')! as 'room' | 'snack';
      if (!(type !== 'room' && type !== 'snack')) {
        this.targetType.set(type);
      }
      this.loadTarget();
      this.getReviewsByTargetId(this.targetId());
    });
  }

  loadTarget() {
    if (this.targetType() === 'room') {
      this.loadRoom();
    } else {
      this.loadSnack();
    }
  }

  loadRoom() {
    this.roomService.getRoomById(this.targetId()).subscribe({
      next: (room) => {
        this.target.set(room);
      },
      error: (err) => {
        const msgDefault = `Error al obtener la sala.`;
        this.HandlerError.handleError(err, this.alertStore, msgDefault);
      },
    });
  }

  loadSnack() {
    this.snackService.getSnackById(this.targetId()).subscribe({
      next: (snack) => {
        this.target.set(snack);
      },
      error: (err) => {
        const msgDefault = `Error al obtener el snack.`;
        this.HandlerError.handleError(err, this.alertStore, msgDefault);
      },
    });
  }

  getReviewsByTargetId(targetId: string) {
    this.reviewService.getReviewsByTargetId(targetId).subscribe({
      next: (reviews) => {
        this.reviews.set(reviews);
      },
      error: (err) => {
        const msgDefault = `Error al obtener las opiniones.`;
        this.HandlerError.handleError(err, this.alertStore, msgDefault);
      },
    });
  }

  deleteReview(reviewId: string) {
    this.reviewService.deleteReviewById(reviewId).subscribe({
      next: () => {
        this.alertStore.addAlert({
          message: 'Opinión eliminada correctamente.',
          type: 'success',
        });
        this.getReviewsByTargetId(this.targetId());
        this.deleteModal.nativeElement.close();
      },
      error: (err) => {
        const msgDefault = `Error al eliminar la opinión.`;
        this.HandlerError.handleError(err, this.alertStore, msgDefault);
      },
    });
  }

  confirmDelete(review: Review) {
    this.deleteReviewId.set(review.id);
    this.deleteModal.nativeElement.showModal();
  }

  deleteReviewModal() {
    this.deleteReview(this.deleteReviewId());
  }

  closeDeleteModal() {
    this.deleteModal.nativeElement.close();
  }

  getAverageRating(): number {
    const reviews = this.reviews();
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  }

  getRatingCount(rating: number): number {
    return this.reviews().filter((review) => review.rating === rating).length;
  }
}
