import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Review } from 'app/modules/CINEMA_ADMIN/models/review.interface';
import { ReviewsService } from 'app/modules/CINEMA_ADMIN/services/reviews.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reviews',
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent implements OnInit {
  
  @ViewChild('deleteModal') deleteModal!: ElementRef<HTMLDialogElement>;

  movieId: string = '';
  reviews: Review[] = [];
  filteredReviews: Review[] = []; 
  loading: boolean = true;
  reviewToDeleteId: string = '';
  selectedRating: number | null = null;
  
   constructor(
    private reviewsService: ReviewsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.movieId = id;
        this.loadReviews();
      }
    });
  }

  loadReviews(): void {
    this.loading = true;
    this.reviewsService.getReviewsByTargetId(this.movieId).subscribe({
      next: (data) => {
        this.reviews = data;
        this.filteredReviews = data; 
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        console.error('Failed to load reviews.');
      },
    });
  }

 filterByRating(): void {
    if (this.selectedRating === null) {
      this.filteredReviews = this.reviews;
    } else {
      this.filteredReviews = this.reviews.filter(
        (r) => r.rating === this.selectedRating
      );
    }
  }


  confirmDelete(reviewId: string): void {
    this.reviewToDeleteId = reviewId;
    this.deleteModal.nativeElement.showModal();
  }
  
  closeDeleteModal() {
    this.deleteModal.nativeElement.close();
    this.reviewToDeleteId = '';
  }

  deleteReview(reviewId: string): void {
    this.reviewsService.deleteReviewById(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter((r) => r.id !== reviewId);
        this.filterByRating();
        this.deleteModal.nativeElement.close();
      },
      error: (err) => {
        console.error('Error al eliminar review:', err);
        this.deleteModal.nativeElement.close();
      },
    });
  }

  deleteReviewModal(): void {
    if (this.reviewToDeleteId) {
      this.deleteReview(this.reviewToDeleteId);
    }
  }
}