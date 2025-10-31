import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Role } from 'app/modules/ADMIN/models/role.interface';
import { User } from 'app/modules/ADMIN/models/user.interface';
import { AdmingService } from 'app/modules/ADMIN/services/adming.service';
import { LucideAngularModule, Users, Plus, Pencil, Trash2, X, Save, PlusCircle} from 'lucide-angular';

@Component({
  selector: 'app-employees',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent implements OnInit{

  users: User[] = [];
  roles: Role[] = [];
  selectedUser: User | null = null;
  currentUserId: string | null = null;
  isCreating = false;
  loading = false;

  constructor(private adminService: AdmingService) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('cinema-client-store');
    if (stored) {
      const parsed = JSON.parse(stored);
      this.currentUserId = parsed.session?.id || null;
    }

    this.loadUsers();
    this.loadRoles();
  }

loadUsers(): void {
  this.loading = true;
  this.adminService.getUsers().subscribe({
    next: (data) => {
      this.users = data
        .filter(u => u.id !== this.currentUserId && u.roleId !== 1)
        .map(u => ({
          ...u,
          roleId: u.roleId,
          roleName: this.roles.find(r => r.id === u.roleId)?.name || 'Sin Rol'
        }));
      this.loading = false;
    },
    error: () => (this.loading = false),
  });
}

  loadRoles(): void {
    this.adminService.getRoles().subscribe({
      next: (roles) => (this.roles = roles),
    });
  }

startCreate(): void {
  this.isCreating = true;
  this.selectedUser = {
    email: '',
    password: '',
    fullName: '',
    roleName: this.roles[0]?.name || 'CLIENTE',
    status: true,
  };
}

  editUser(user: User): void {
    this.isCreating = false;
    this.selectedUser = { ...user };
  }

  cancelEdit(): void {
    this.selectedUser = null;
  }

saveUser(): void {
  if (!this.selectedUser) return;

  if (!this.isCreating) {
    const selectedRole = this.roles.find(r => r.name === this.selectedUser!.roleName);
    if (selectedRole) {
      this.selectedUser.roleId = selectedRole.id;
    }
  }

  if (this.isCreating) {
    this.adminService.createUser(this.selectedUser).subscribe({
      next: () => {
        this.selectedUser = null;
        this.isCreating = false;
        alert('Usuario creado correctamente');
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
        alert('Error al crear el usuario');
      },
    });
  } else {
    const userToUpdate = {
      email: this.selectedUser.email,
      password: this.selectedUser.password,
      fullName: this.selectedUser.fullName,
      roleId: this.selectedUser.roleId,
      status: this.selectedUser.status
    };

    this.adminService.updateUser(this.selectedUser.id!, userToUpdate).subscribe({
      next: () => {
        this.selectedUser = null;
        alert('Usuario actualizado correctamente');
        window.location.reload();
      },
      error: (err) => {
        console.error(err);
        alert('Error al actualizar el usuario');
      },
    });
  }
}

  deleteUser(id: string): void {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      this.adminService.deleteUser(id).subscribe({
        next: ()=> {
          this.loadUsers();
          alert('usuario eliminado correctament');
        },
        error: (err) => {
          console.error(err);
          alert('Error al eliminar el usuario');
        }
      });
    }
  }  
}
