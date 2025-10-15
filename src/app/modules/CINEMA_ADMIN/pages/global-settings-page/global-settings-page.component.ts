import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import {
  Building,
  Info,
  Image,
  ImagePlus,
  Armchair,
  Edit,
  Plus,
  Save,
} from 'lucide-angular';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Session } from 'app/modules/session/models/auth';
import { Cinema } from '../../models/cinema.interface';
import { FormsModule } from '@angular/forms';
import { UploadImgService } from '../../services/uploadImg.service';
import { AlertStore } from 'app/store/alert.store';
import { ImagePipe } from '@shared/pipes/image.pipe';
import { CinemaService } from '../../services/cinema.service';
import { Router } from '@angular/router';
import { HandlerError } from '@shared/utils/handlerError';

@Component({
  selector: 'app-global-settings-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, ImagePipe],
  templateUrl: './global-settings-page.component.html',
})
export class GlobalSettingsPageComponent {
  readonly Building = Building;
  readonly Info = Info;
  readonly Image = Image;
  readonly ImagePlus = ImagePlus;
  readonly Armchair = Armchair;
  readonly Edit = Edit;
  readonly Plus = Plus;
  readonly Save = Save;

  private readonly localStorageService = inject(LocalStorageService);
  private readonly uploadService = inject(UploadImgService);
  private readonly alertStore = inject(AlertStore);
  private readonly cinemaService = inject(CinemaService);
  private readonly router = inject(Router);
  private HandlerError = HandlerError;

  file!: File;
  formData!: FormData;

  isUpdate = signal(false);
  imageUrl: string | null = null;
  session: Session = this.localStorageService.getState().session;
  costGlobal = signal(0);
  cinema = signal<Cinema>({
    address: '',
    adminUserId: this.session.id,
    dailyCost: 0,
    id: '',
    imageUrl: '',
    name: '',
  });

  ngOnInit() {
    this.getCostGlobal();
    this.loadCinema();
  }

  getCostGlobal() {
    this.cinemaService.getCostGlobal().subscribe({
      next: (cost) => {
        this.costGlobal.set(cost.cost);
      },
      error: (err) => {
        this.costGlobal.set(0);
        console.error('Error al obtener el costo global:', err);
      },
    });
  }

  loadCinema() {
    this.cinemaService.getCinemaByAdminUserId(this.session.id).subscribe({
      next: (cinema) => {
        if (cinema) {
          this.cinema.set(cinema);
          this.isUpdate.set(true);
          this.imageUrl = cinema.imageUrl;
        } else {
          this.isUpdate.set(false);
          this.cinema().dailyCost = this.costGlobal();
          console.warn('No se encontró el cine para este administrador.');
        }
      },
      error: (err) => {
        this.isUpdate.set(false);
        console.error('Error al obtener el cine:', err);
      },
    });
  }

  async saveSettings() {
    // validar campos de cinema
    if (!this.isUpdate() && this.cinema().imageUrl.trim() === '') {
      this.alertStore.addAlert({
        message: `Por favor, complete todos los campos correctamente.`,
        type: 'info',
      });
      return;
    }

    if (
      this.cinema().address.trim() === '' ||
      this.cinema().name.trim() === '' ||
      Number(this.cinema().dailyCost) <= 0
    ) {
      this.alertStore.addAlert({
        message: `Por favor, complete todos los campos correctamente.`,
        type: 'info',
      });
      return;
    }

    if (this.file) {
      await this.uplogadImag();
    }

    if (this.isUpdate()) {
      this.updateCinema();
    } else {
      this.createCinema();
    }
  }

  createCinema() {
    this.cinemaService.createCinema(this.cinema()).subscribe({
      next: (cinema) => {
        this.cinema.set(cinema);
        this.isUpdate.set(true);
        this.alertStore.addAlert({
          message: `Cine creado correctamente.`,
          type: 'success',
        });
        this.loadCinema();
        this.router.navigate(['/cinema/dashboard']);
      },
      error: (err) => {
        console.error('Error al crear el cine:', err);
        const msgDefault = `Error al crear el cine. Inténtelo de nuevo más tarde.`;
        this.HandlerError.handleError(err, this.alertStore, msgDefault);
      },
    });
  }

  updateCinema() {
    this.cinemaService.updateCinema(this.cinema()).subscribe({
      next: (cinema) => {
        this.cinema.set(cinema);
        this.alertStore.addAlert({
          message: `Cine actualizado correctamente.`,
          type: 'success',
        });
      },
      error: (err) => {
        console.error('Error al actualizar el cine:', err);
        const msgDefault = `Error al actualizar el cine. Inténtelo de nuevo más tarde.`;
        this.HandlerError.handleError(err, this.alertStore, msgDefault);
      },
    });
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (
      inputElement != null &&
      inputElement.files != null &&
      inputElement.files.length > 0
    ) {
      this.file = inputElement.files[0];
      this.formData = new FormData();
      this.formData.append('file', this.file, this.file.name);
      this.cinema().imageUrl =
        'https://res.cloudinary.com/ddkp3bobz/image/upload/v1742243659.web';
    }
  }

  private async uplogadImag(): Promise<void> {
    if (this.formData) {
      try {
        const value = await this.uploadService
          .saveImg(this.formData)
          .toPromise();
        this.cinema().imageUrl = value.image;
        this.imageUrl = value.image;
      } catch (err) {
        this.cinema().imageUrl = '';
        throw new Error('Error en uplogadImag');
      }
    }
  }
}
