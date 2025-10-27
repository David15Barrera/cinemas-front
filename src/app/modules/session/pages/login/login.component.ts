import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Login, Session } from '../../models/auth';
import { AlertStore } from 'app/store/alert.store';
import { AuthStore } from 'app/store/auth.store';
import { CinemaService } from 'app/modules/CINEMA_ADMIN/services/cinema.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export default class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly alertStore = inject(AlertStore);
  private readonly store = inject(AuthStore);
  private readonly cinemaService = inject(CinemaService);

  errorMessage: string = '';
  showPassword = false;

  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(2)]],
  });

  login() {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, ingrese todos los campos';
      return;
    }

    const login: Login = this.loginForm.getRawValue();

    this.authService.login(login).subscribe({
      next: (value: Session) => {
        // console.log(value);

        this.store.updateSession(value);
        this.redirect(value.roleName);
      },
      error: (error) => {
        this.handleErrorLogin(error);
      },
    });
  }

  handleErrorLogin(error: any) {
    const erroCode: number = error.error.status;
    const msg = error.error.message;
    switch (erroCode) {
      case 500:
        this.alertStore.addAlert({
          message: `Ah ocurrido un error al iniciar sesion, intente mas tarde, diculpe las molestias`,
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
        this.store.logout();
        this.alertStore.addAlert({
          message: 'Rol no reconocido. Por favor inicie sesión nuevamente.',
          type: 'error',
        });
        this.router.navigate(['/session/login']);
        break;
    }
  }

  toRegister() {
    this.router.navigate(['/session/register']);
  }

  toFind() {
    this.router.navigate(['/session/find']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
