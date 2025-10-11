import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Register, Role } from '../../models/auth';
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
  roles: Role[] = [];
  
  ngOnInit() {
    this.getRoles();
  }

  registerForm: FormGroup = this.formBuilder.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    passwordConfirm: ['', [Validators.required, Validators.minLength(6)]],
    role: ['', Validators.required]
  });


register() {
  if (this.registerForm.invalid) {
    this.errorMessage = 'Por favor, ingrese todos los campos';
    return;
  }

  if (this.registerForm.value.password !== this.registerForm.value.passwordConfirm) {
    this.errorMessage = 'Las contraseñas no coinciden';
    return;
  }

  const { email, password, fullName, role } = this.registerForm.value;
  const register: Register = { email, password, fullName, role };

  this.authService.register(register).subscribe({
    next: () => {
      console.log('Registro completado');
      this.store.updateEmail(email);
      this.router.navigate(['/session/confirmation']);
    },
    error: (error) => {
      this.handlerErrorRegister(error);
    },
  });
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

  getRoles() {
    this.authService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.addRoleDescription();
      },
      error: (error) => {
        console.error('Error fetching roles:', error);
      }
    })
  }

  private addRoleDescription(){
    this.roles.forEach(role => {
      if (role.name === 'ADMIN_CINE') {
        role.description = 'Administrador de Cine';
      }
      if (role.name === 'ANUNCIADOR') {
        role.description = 'publicador de anuncios';
      }
      if (role.name === 'CLIENTE') {
        role.description = 'Reservar y comprar entradas';
      }
    })
  }

}
