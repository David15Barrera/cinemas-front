import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ModalStore } from 'app/store/modal.store';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-modal',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnInit, OnDestroy {
  private readonly modalStore = inject(ModalStore);

  readonly Close = X;

  @ViewChild('modal') modalRef!: ElementRef;
  @ViewChild('closeButton') closeButtonRef!: ElementRef;

  content?: { new (): unknown };
  inputs?: Record<string, unknown>;

  constructor() {
    effect(async () => {});
  }

  ngOnInit() {
    this.modalStore.setModalCallback(
      async (loadComponent, inputs) => {
        this.content = await loadComponent();
        this.inputs = inputs;
        this.modalRef.nativeElement.showModal();
      },
      () => {
        this.closeButtonRef.nativeElement.click();
      }
    );
  }

  ngOnDestroy() {
    this.modalStore.setModalCallback(undefined, undefined);
  }
}
