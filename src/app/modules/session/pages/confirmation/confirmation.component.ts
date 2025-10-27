import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Confirmation, Session } from '../../models/auth';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthStore } from 'app/store/auth.store';
import { AlertStore } from 'app/store/alert.store';
import { ModalMsgComponent } from '@shared/components/modal-msg/modal-msg.component';
import { CinemaService } from 'app/modules/CINEMA_ADMIN/services/cinema.service';

@Component({
  selector: 'app-confirmation',
  imports: [ReactiveFormsModule, ModalMsgComponent],
  templateUrl: './confirmation.component.html',
})
export default class ConfirmationComponent {
  @ViewChild('modal1') modalRef2!: ElementRef<HTMLDialogElement>;

  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly store = inject(AuthStore);
  private readonly alertStore = inject(AlertStore);
  private readonly cinemaService = inject(CinemaService);

  classSucces = 'text-purple-700 text-lg';
  titleModal = 'Confrimacion Exitosa';
  contentModal = 'Su cuenta ya fue creada exitosamente';

  errorMessage: string = '';

  confirmationForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    code: ['', [Validators.required, Validators.minLength(4)]],
  });

  constructor() {
    const email: string = this.store.session.email();
    if (!email) {
      this.toLogin();
    }

    this.confirmationForm.patchValue({ email });
  }

  confirm() {
    this.errorMessage = '';
    console.log(this.confirmationForm.value);

    if (this.confirmationForm.invalid) {
      this.errorMessage = 'Por favor, ingrese el codigo de confirmación';
      return;
    }

    const confirmation: Confirmation = this.confirmationForm.getRawValue();

    this.authService.confirmation(confirmation).subscribe({
      next: (response: Session) => {
        this.modalRef2.nativeElement.showModal();

        this.modalRef2.nativeElement.addEventListener(
          'close',
          () => {
            this.store.updateSession(response);
            this.redirect(response.roleName);
          },
          { once: true }
        );
      },
      error: (error) => {
        this.handleErrorConfirmation(error);
      },
    });
  }

  redirect(role: string) {
    switch (role) {
      case 'ADMIN_SIS':
        this.router.navigate(['/admin']);
        break;

      case 'ADMIN_CINE':
        this.cinemaService.clearCinema();
        this.router.navigate(['/cinema']);
        break;

      case 'ANUNCIADOR':
        this.router.navigate(['/adviertiser']);
        break;

      case 'CLIENTE':
        this.router.navigate(['/client']);
        break;

      default:
        this.router.navigate(['/session/login']);
        break;
    }
  }

  handleErrorConfirmation(error: any) {
    const erroCode: number = error.error.status;
    const msg = error.error.message;
    switch (erroCode) {
      case 500:
        this.alertStore.addAlert({
          message: `Ah ocurrido un al confirmar su cuenta, intente mas tarde, diculpe las molestias`,
          type: 'error',
        });
        break;
      default:
        this.alertStore.addAlert({
          message: msg,
          type: 'error',
        });
        break;
    }
  }

  toLogin() {
    this.router.navigate(['/session/login']);
  }
}
