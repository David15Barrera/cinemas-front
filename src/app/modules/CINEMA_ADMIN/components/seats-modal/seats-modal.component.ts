import {
  Component,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { Armchair, LucideAngularModule } from 'lucide-angular';
import { Seat } from '../../models/seat.interface';
import { Room } from '../../models/room.interface';
import { SeatService } from '../../services/seat.service';
import { AlertStore } from 'app/store/alert.store';

@Component({
  selector: 'app-seats-modal',
  imports: [LucideAngularModule],
  templateUrl: './seats-modal.component.html',
})
export class SeatsModalComponent {
  readonly Armchair = Armchair;

  // inputs
  room = input<Room | null>(null);
  @Output() close = new EventEmitter<void>();

  //injeccion de serivicos
  private readonly seatService = inject(SeatService);
  private readonly alertStore = inject(AlertStore);

  seats = signal<Seat[]>([]);
  gridCols = 'grid-cols-';

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['room'] && changes['room'].currentValue) {
      this.getSeatsByRoomId(this.room()!.id);
      this.gridCols = `grid-cols-${this.room()!.columns}`;
    }
  }

  getSeatsByRoomId(roomId: string) {
    this.seatService.getSeatsByRoomId(roomId).subscribe({
      next: (seats) => {
        this.seats.set(seats);        
      },
      error: (error) => {
        this.alertStore.addAlert({
          message: `No se pudo obtener asientos para la sala.`,
          type: 'info',
        });
        this.onClose();
        this.seats.set([]);
      },
    });
  }

  onClose() {
    this.close.emit();
  }
}
