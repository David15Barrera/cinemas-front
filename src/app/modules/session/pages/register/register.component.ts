import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Register } from '../../models/auth';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthStore } from 'app/store/auth.store';
import { AlertStore } from 'app/store/alert.store';
import { AuthPage } from '@shared/models/auth-control-page';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
})
export default class RegisterComponent {


  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router);
  private readonly store = inject(AuthStore);
  private readonly alertStore = inject(AlertStore);

  showPassword = false;
  errorMessage: string = '';

  registerForm: FormGroup = this.formBuilder.group({
    cui: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    passwordConfirm: ['', [Validators.required, Validators.minLength(6)]],
  });

  register() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor, ingrese todos los campos';
      return
    }

    if (this.registerForm.value.password !== this.registerForm.value.passwordConfirm) {
      this.errorMessage = 'Las Contraseñas no coinciden';
      return
    }

    const register: Register = this.registerForm.getRawValue();


    this.authService.register(register).subscribe({
      next: () => {
        console.log('completado');

        this.store.updateEmail(register.email)
        this.router.navigate(['/session/confirmation']);
      },
      error: (error) => {
        //console.log(error);
        this.handlerErrorRegister(error);
      }
    })
  }

  handlerErrorRegister(error: any) {
    const erroCode: number = error.error.status
    const msg = error.error.message
    switch (erroCode) {
      case 500:
        this.alertStore.addAlert({
          message: `Ah ocurrido un error al registrarse, intente mas tarde, diculpe las molestias`,
          type: 'error',
        });
        break
      default:
        this.alertStore.addAlert({
          message: msg,
          type: 'error',
        });
        break
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toLogin() {
    this.router.navigate(['/session/login']);
  }

}
