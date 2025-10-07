import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal-msg',
  imports: [],
  templateUrl: './modal-msg.component.html',
  styleUrl: './modal-msg.component.css'
})
export class ModalMsgComponent {
  @Input() title!: string;
  @Input() content!: string;
  @Input() className!: string;
}
