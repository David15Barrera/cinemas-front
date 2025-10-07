import {
  Component,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
} from '@angular/core';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Promotion } from 'app/modules/RESERVATION/models/promotion.interface';
import { PromotionService } from 'app/modules/RESERVATION/services/Promotion.service';
import { Session } from 'app/modules/session/models/auth';

@Component({
  selector: 'app-promotions-modal',
  imports: [],
  templateUrl: './promotions-modal.component.html',
})
export class PromotionsModalComponent {
  // output
  @Output() close = new EventEmitter<void>();

  // input
  disheId = input.required<string>();

  private readonly promotionService = inject(PromotionService);
  private readonly localStorageService = inject(LocalStorageService);

  session: Session = this.localStorageService.getState().session;

  promotionCustomer = signal<Promotion | null>(null);
  promotionDishe = signal<Promotion | null>(null);

  ngOnInit(): void {
    this.getPromotionByDisheId(this.disheId());
    this.getPromotionByCustomerId(this.session.customerId);
  }

  ngOnChanges(): void {
    this.getPromotionByDisheId(this.disheId());
    this.getPromotionByCustomerId(this.session.customerId);
  }

  onClose() {
    this.close.emit();
  }

  // get promotion by customer id
  getPromotionByCustomerId(customerId: string) {
    this.promotionService.getAllPromotionsByCustomerId(customerId).subscribe({
      next: (promotions) => {
        if (promotions.length > 0) {
          this.promotionCustomer.set(promotions[0]);
        } else {
          this.promotionCustomer.set(null);
        }
      },
      error: (error) => {
        console.error('Error fetching promotions by customer ID:', error);
        this.promotionCustomer.set(null);
      },
    });
  }

  // get promotion by dishe id
  getPromotionByDisheId(disheId: string) {
    this.promotionService.getAllPromotionsByDishesId(disheId).subscribe({
      next: (promotions) => {
        if (promotions.length > 0) {
          this.promotionDishe.set(promotions[0]);
        } else {
          this.promotionDishe.set(null);
        }
      },
      error: (error) => {
        console.error('Error fetching promotions by dishe ID:', error);
        this.promotionDishe.set(null);
      },
    });
  }
}
