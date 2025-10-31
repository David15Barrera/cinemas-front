import { Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { 
  BadgePlus, 
  Calendar, 
  FileText, 
  Image, 
  Video, 
  Tag, 
  Save, 
  X 
} from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Ad, AdsStatus, AdsTargetType } from '../../models/ad.interface';
import { UploadImgService } from 'app/modules/CINEMA_ADMIN/services/uploadImg.service';
import { AlertStore } from 'app/store/alert.store';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Session } from 'app/modules/session/models/auth';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AdsService } from '../../services/ads.service';

@Component({
  selector: 'app-create-ads',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule
  ],
  templateUrl: './create-ads.component.html',
  styleUrls: ['./create-ads.component.css']
})
export class CreateAdsComponent {
  readonly BadgePlus = BadgePlus;
  readonly Calendar = Calendar;
  readonly FileText = FileText;
  readonly Image = Image;
  readonly Video = Video;
  readonly Tag = Tag;
  readonly Save = Save;
  readonly X = X;

  readonly AdsTargetType = AdsTargetType;


  adForm:Ad = {
    id: '',
    advertiserId: '',
    targetType: AdsTargetType.TEXT,
    adStatus:AdsStatus.PENDING_PAYMENT,
    content: '',
    totalCost:0,
    imageUrl: '',
    videoUrl: ''
  };

  startDateString = '';
  adDuration: number = 1;

  selectedImageFile: File | null = null;
  imagePreview: string | null = null;
  videoPreview: SafeResourceUrl | null = null;
  isUploading = false;

  private readonly _uploadService = inject(UploadImgService);
  private readonly alertStore = inject(AlertStore);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly _adsService = inject(AdsService)

  session: Session = this.localStorageService.getState().session;

  calculateEndDate(): Date | null {
      if (!this.startDateString || !this.adDuration) {
        return null;
      } 
      const startDate = new Date(this.startDateString);
      const endDate = new Date(startDate.getTime() + (this.adDuration * 24 * 60 * 60 * 1000));
      
      return endDate;
  }

  onVideoUrlChange(): void {
    if (this.adForm.videoUrl && this.adForm.videoUrl.trim() !== '') {
      const videoId = this.extractYouTubeId(this.adForm.videoUrl);
      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        this.videoPreview = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      } else {
        this.videoPreview = null;
        this.alertStore.addAlert({
          message: 'URL de YouTube no válida. Usa el formato: https://www.youtube.com/watch?v=VIDEO_ID',
          type: 'warning',
        });
      }
    } else {
      this.videoPreview = null;
    }
  }

  private extractYouTubeId(url: string): string | null {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  }

  private isValidYouTubeUrl(url: string): boolean {
    return this.extractYouTubeId(url) !== null;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedImageFile);
    }
  }

async saveAd() {
  this.isUploading = true;
  this.adForm.advertiserId = this.session.id

  try {
    if (!this.startDateString) {
      this.alertStore.addAlert({
        message: 'La fecha de inicio es obligatoria.',
        type: 'error',
      });
      return;
    }

    const endDate = this.calculateEndDate();
    
    if (!endDate) {
      this.alertStore.addAlert({
        message: 'No se pudo calcular la fecha de fin.',
        type: 'error',
      });
      return;
    }

    if (!this.adForm.advertiserId || this.adForm.advertiserId.trim() === '') {
      this.alertStore.addAlert({
        message: 'El ID del anunciante es obligatorio.',
        type: 'error',
      });
      return;
    }

    if (this.adForm.targetType === AdsTargetType.TEXT) {
      if (!this.adForm.content || this.adForm.content.trim() === '') {
        this.alertStore.addAlert({
          message: 'El contenido del anuncio es obligatorio.',
          type: 'error',
        });
        return;
      }
    } else if (this.adForm.targetType === AdsTargetType.TEXT_IMAGE) {
      if (!this.adForm.content || this.adForm.content.trim() === '') {
        this.alertStore.addAlert({
          message: 'El contenido del anuncio es obligatorio.',
          type: 'error',
        });
        return;
      }
      if (!this.selectedImageFile) {
        this.alertStore.addAlert({
          message: 'Debes seleccionar una imagen para el anuncio.',
          type: 'error',
        });
        return;
      }
    } else if (this.adForm.targetType === AdsTargetType.VIDEO) {
      if (!this.adForm.videoUrl || this.adForm.videoUrl.trim() === '') {
        this.alertStore.addAlert({
          message: 'La URL del video es obligatoria.',
          type: 'error',
        });
        return;
      }
      if (!this.isValidUrl(this.adForm.videoUrl)) {
        this.alertStore.addAlert({
          message: 'La URL del video no es válida.',
          type: 'error',
        });
        return;
      }
    }

    const adToSave: Partial<Ad> = {
    advertiserId: this.adForm.advertiserId,
    targetType: this.adForm.targetType,
    startDate: new Date(this.startDateString),
    endDate: endDate
  };

    if (this.adForm.targetType === AdsTargetType.TEXT) {
      adToSave.content = this.adForm.content;
      adToSave.imageUrl = '';
      adToSave.videoUrl = '';
    } else if (this.adForm.targetType === AdsTargetType.TEXT_IMAGE) {
      adToSave.content = this.adForm.content;
      adToSave.videoUrl = '';
      
      if (this.selectedImageFile) {
        const formData = new FormData();
        formData.append('file', this.selectedImageFile);
        
        await this.uploadImag(formData);
        
        if (!this.adForm.imageUrl || this.adForm.imageUrl.trim() === '') {
          this.alertStore.addAlert({
            message: 'Error al subir la imagen. Inténtalo de nuevo.',
            type: 'error',
          });
          return;
        }
        
        adToSave.imageUrl = this.adForm.imageUrl;      
      }
    } else if (this.adForm.targetType === AdsTargetType.VIDEO) {
      adToSave.content = '';
      adToSave.imageUrl = '';
      adToSave.videoUrl = this.adForm.videoUrl;
    }

    console.log('Datos del anuncio a guardar:', adToSave);
    
    await this._adsService.createAd(adToSave as Ad).toPromise();
    
    this.alertStore.addAlert({
      message: 'Anuncio creado correctamente.',
      type: 'success',
    });
    this.resetForm();
    
  } catch (error) {
    console.error('Error al guardar el anuncio:', error);
    this.alertStore.addAlert({
      message: 'Error al guardar el anuncio. Inténtalo de nuevo.',
      type: 'error',
    });
  } finally {
    this.isUploading = false;
  }
}

private isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

private resetForm(): void {
  this.adForm = {
    id:'',
    advertiserId: '',
    adStatus: AdsStatus.PENDING_PAYMENT,
    targetType: AdsTargetType.TEXT,
    content: '',
    totalCost:0,
    imageUrl: '',
    videoUrl: '',
  };
  this.startDateString = '';
  this.adDuration = 1;
  this.selectedImageFile = null;
  this.imagePreview = null;
}

 private async uploadImag(formData: FormData): Promise<void> {
    if (formData) {
      try {
        const value = await this._uploadService
          .saveImg(formData)
          .toPromise();
          this.adForm.imageUrl = value.image
      } catch (err) {
        this.alertStore.addAlert({
            message: 'Error al subir la imagen. Inténtalo de nuevo.',
            type: 'error',
          });
          console.log(err)
      }
    }
  }
}