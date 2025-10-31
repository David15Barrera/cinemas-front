import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.interface';
import { AdmingService } from '../../services/adming.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-setting-general',
  imports: [FormsModule, CommonModule],
  templateUrl: './setting-general.component.html',
  styleUrl: './setting-general.component.css'
})
export class SettingGeneralComponent implements OnInit{
  
  currentUserId: string | null = null;
  confirmPassword: string = '';
  userData: User | null = null;
  loading = false;
  updating = false;

  constructor(private adminService: AdmingService) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('cinema-client-store');
    if (stored) {
      const parsed = JSON.parse(stored);
      this.currentUserId = parsed.session?.id || null;
    }

    if (this.currentUserId) {
      this.loadUserData(this.currentUserId);
    }
  }

  loadUserData(id: string): void {
    this.loading = true;
    this.adminService.getUserById(id).subscribe({
      next: (data) => {
        this.userData = { ...data, password: '' }; // no mostramos contraseña
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuario:', err);
        this.loading = false;
      }
    });
  }

  updateUser(): void {
    if (!this.userData || !this.currentUserId) return;

  if (this.userData.password && this.userData.password !== this.confirmPassword) {
    alert('Las contraseñas no coinciden');
    return;
  }

    this.updating = true;
  
    const userToUpdate: User = {
      email: this.userData.email,
      password: this.userData.password || undefined,
      fullName: this.userData.fullName,
      roleId: this.userData.roleId,
      roleName: this.userData.roleName,
      status: this.userData.status
    };

    this.adminService.updateUser(this.currentUserId, userToUpdate).subscribe({
      next: () => {
        alert('Información actualizada correctamente');
        this.updating = false;
        this.userData!.password = '';
      },
      error: (err) => {
        console.error(err);
        alert('Error al actualizar el usuario');
        this.updating = false;
      }
    });
  }
}
