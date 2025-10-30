import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagePipe } from '@shared/pipes/image.pipe';
import { Room } from 'app/modules/CINEMA_ADMIN/models/room.interface';
import { RoomService } from 'app/modules/CINEMA_ADMIN/services/Room.service';

import { Users, Grid, MessageCircle, AlertCircle, LucideAngularModule, ArrowLeft} from 'lucide-angular';

@Component({
  selector: 'app-view-rooms',
  templateUrl: './view-rooms.component.html',
  styleUrls: ['./view-rooms.component.css'],
  standalone: true,
  imports: [LucideAngularModule, ImagePipe, FormsModule, CommonModule]
})
export class ViewRoomsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly _roomsService = inject(RoomService);
  private readonly _router = inject(Router);

  cinemaId!: string;
  rooms: Room[] = [];

  Users = Users;
  Grid = Grid;
  MessageCircle = MessageCircle;
  AlertCircle = AlertCircle;
  ArrowLeft = ArrowLeft;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.cinemaId = id;
        this.loadRooms();
      }
    });
  }

  loadRooms() {
    this._roomsService.getRoomsByCinemaId(this.cinemaId).subscribe({
      next: (response) => {
        this.rooms = response;
      }
    });
  }

  viewReview(target: Room, type: 'room') {
    this._router.navigate(['/client/review', target.id], {
      state: { data: target, type: type }
    });
  }

  goBack() {
    this._router.navigate(['/client/dashboard']);
  }
}
