import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-find',
  imports: [ReactiveFormsModule],
  templateUrl: './find.component.html',
})
export default class FindComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  errorMessage: string = '';

  findForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });


  find() {
    this.errorMessage = '';

    if (this.findForm.invalid) {
      this.errorMessage = 'Por favor, ingrese un correo valido';
      return
    }

    const email: string = this.findForm.value.email

    //TODO: Consume api endpoint
    this.toRecover();
  }

  handleErrorFind(error: any) {

  }

  toLogin() {
    this.router.navigate(['/session/login']);
  }

  toRecover() {
    this.router.navigate(['/session/recover']);
  }
}
