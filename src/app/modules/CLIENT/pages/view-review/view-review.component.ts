import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, ArrowLeft, MapPin, DollarSign, Shield, Clock, User, MessageSquare, Send, List, AlertCircle, Grid, Users } from 'lucide-angular';
import { Cinema } from 'app/modules/CINEMA_ADMIN/models/cinema.interface';
import { Movie } from 'app/modules/CINEMA_ADMIN/models/movie.interface';
import { Snack } from 'app/modules/CINEMA_ADMIN/models/snack.interface';
import { ImagePipe } from '@shared/pipes/image.pipe';
import { ReviewsService } from 'app/modules/CINEMA_ADMIN/services/reviews.service';
import { Review } from 'app/modules/CINEMA_ADMIN/models/review.interface';
import { Session } from 'app/modules/session/models/auth';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { AlertStore } from 'app/store/alert.store';
import { HandlerError } from '@shared/utils/handlerError';
import { Room } from 'app/modules/CINEMA_ADMIN/models/room.interface';

@Component({
  selector: 'app-view-review',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    ImagePipe
  ],
  templateUrl: './view-review.component.html',
  styleUrl: './view-review.component.css'
})
export class ViewReviewComponent implements OnInit {

  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly _reviewService = inject(ReviewsService)
  private readonly _localStorageService = inject(LocalStorageService)
  private readonly _alertStore = inject(AlertStore)
  private HandlerError = HandlerError;


  readonly ArrowLeft = ArrowLeft;
  readonly MapPin = MapPin;
  readonly DollarSign = DollarSign;
  readonly Shield = Shield;
  readonly Clock = Clock;
  readonly User = User;
  readonly MessageSquare = MessageSquare;
  readonly Send = Send;
  readonly List = List;
  readonly AlertCircle = AlertCircle;
  readonly Grid = Grid;
  readonly Users = Users


  session: Session = this._localStorageService.getState().session;

  targetId: string = '';
  targetData: Cinema | Movie | Snack | Room| null = null;
  targetType: 'cinema' | 'movie' | 'snack' | 'room'| null = null;

  newReview = {
    rating: 0,
    comment: ''
  };
  reviews: Review[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.targetId = id;
      }
    });

    const state = window.history.state;
    
    if (state && state.data) {
      this.targetData = state.data;
      this.targetType = state.type;

      if(this.targetType == 'cinema'){
        this.router.navigate(['/client/rooms', this.targetData?.id], {
          state: { 
            data: this.targetData,
            type: this.targetType
          }
        });
      }

      this.loadReviews();
    } else {
      console.warn('No se recibió data en el state');
    }
  }

  isCinema(data: any): data is Cinema {
    return this.targetType === 'cinema';
  }

  isRoom(data: any): data is Room {
    return this.targetType === 'room';
  }


  isMovie(data: any): data is Movie {
    return this.targetType === 'movie';
  }

  isSnack(data: any): data is Snack {
    return this.targetType === 'snack';
  }

  goBack() {
    this.router.navigate(['/client/dashboard']);
  }

  submitReview() {
    if (this.newReview.rating === 0 || !this.newReview.comment.trim()) {
      return;
    }

    const newReviewPayload: Review = {
      id: '',
      userId: this.session.id,
      userName: this.session.fullName,
      targetId: this.targetId,
      targetType: this.targetType?.toUpperCase() ?? '',
      title: 'Reseña de usuario',
      rating: this.newReview.rating,
      comment: this.newReview.comment,
      createdAt: '',
      updatedAt: ''
      
    };

    this._reviewService.createRevies(newReviewPayload).subscribe({
      next: (createdReview) => {
        this._alertStore.addAlert({
          message: 'Reseña guardada correctamente.',
          type: 'success',
        });
        this.loadReviews()
        this.newReview = { rating: 0, comment: '' };

      },
      error: (err) => {
        const msgDefault = `Error al guardar la reseña.`;
        this.HandlerError.handleError(err, this._alertStore, msgDefault);
        console.log(err)
      },
    });
  }


  loadReviews() {
  this._reviewService.getReviewsByTargetId(this.targetId).subscribe({
    next: (response) => {
      this.reviews = response.map(r => ({
        id: r.id,
        userId: r.userId ?? '',
        targetId: r.targetId ?? this.targetId,
        targetType: r.targetType ?? this.targetType ?? '',
        title: r.title ?? '',
        rating: r.rating ?? 0,
        comment: r.comment ?? '',
        userName: r.userName ?? 'Anónimo',
        createdAt: r.createdAt ?? '',
        updatedAt: r.updatedAt ?? ''
      }));
    }
  });
}

}