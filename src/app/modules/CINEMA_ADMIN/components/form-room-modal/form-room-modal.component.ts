import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-form-room-modal',
  imports: [],
  templateUrl: './form-room-modal.component.html',
})
export class FormRoomModalComponent {
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
