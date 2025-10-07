import { Component, inject } from '@angular/core';
import { Recover } from '../../models/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recover',
  imports: [ReactiveFormsModule],
  templateUrl: './recover.component.html',
})
export default class RecoverComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  errorMessage: string = '';

  showPassword = false;

  recoverForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  recover() {
    this.errorMessage = '';

    if (this.recoverForm.invalid) {
      this.errorMessage = 'Por favor, ingrese todos los campos';
      return
    }

    const recover: Recover = this.recoverForm.getRawValue();
  }

  handleErrorLogin(error: any) {

  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toFind() {
    this.router.navigate(['/session/find']);
  }
}
