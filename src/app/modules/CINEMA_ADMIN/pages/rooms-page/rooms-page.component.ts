import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  Building,
  Info,
  Image,
  ImagePlus,
  Armchair,
  Edit,
  Plus,
  Save,
  Eye,
  LucideAngularModule,
} from 'lucide-angular';
import { FormRoomModalComponent } from '../../components/form-room-modal/form-room-modal.component';

@Component({
  selector: 'app-rooms-page',
  imports: [LucideAngularModule, FormRoomModalComponent],
  templateUrl: './rooms-page.component.html',
})
export class RoomsPageComponent {
  readonly Building = Building;
  readonly Info = Info;
  readonly Image = Image;
  readonly ImagePlus = ImagePlus;
  readonly Armchair = Armchair;
  readonly Edit = Edit;
  readonly Plus = Plus;
  readonly Save = Save;
  readonly Eye = Eye;

  @ViewChild('modalFormRoom')
  modalFromRoom!: ElementRef<HTMLDialogElement>;

  openModalFormRoom() {
    this.modalFromRoom.nativeElement.showModal();
  }

  closeModalFormRoom() {
    this.modalFromRoom.nativeElement.close();
  }
}
