import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AdsService } from '../../services/ads.service';
import { Session } from 'app/modules/session/models/auth';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Ad } from '../../models/ad.interface';
import { HandlerError } from '@shared/utils/handlerError';
import { AlertStore } from 'app/store/alert.store';
import { LucideAngularModule, Clock, Tag, Calendar, CheckCircle, XCircle, AlertCircle, DollarSign } from 'lucide-angular';
import { ImagePipe } from '@shared/pipes/image.pipe';
import { FormsModule } from '@angular/forms';
import { CreateWallet, Wallet } from 'app/modules/CINEMA_ADMIN/models/finance.interface';
import { FinanceService } from 'app/modules/CINEMA_ADMIN/services/finance.service';

@Component({
  selector: 'app-myads',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ImagePipe, FormsModule],
  templateUrl: './myads.component.html',
  styleUrl: './myads.component.css'
})
export class MyadsComponent implements OnInit {

  @ViewChild('adDetailsModal') adDetailsModal!: ElementRef<HTMLDialogElement>;

  myAds: Ad[] = [];
  filteredAds: Ad[] = [];
  selectedStatus: string = ''; 
  selectedAd: Ad | null = null;
  safeVideoUrl: SafeResourceUrl | null = null;
  
  Clock = Clock;
  Tag = Tag;
  Calendar = Calendar;
  CheckCircle = CheckCircle;
  XCircle = XCircle;
  AlertCircle = AlertCircle;
  DollarSign = DollarSign;

  private readonly _adsService = inject(AdsService);
  private readonly _walletService = inject(FinanceService)
  private readonly localStorageService = inject(LocalStorageService);
  private readonly alertStore = inject(AlertStore);
  private readonly sanitizer = inject(DomSanitizer);

  session: Session = this.localStorageService.getState().session;

  wallet!:Wallet

  private HandlerError = HandlerError;
  
  constructor() {}

  ngOnInit(): void {
    this.loadMyAds();
    this.loadWallet();
  }

  loadWallet(): void {
        this._walletService.findWalletByOwnerId(this.session.id).subscribe({
          next: (response) => {
            this.wallet = response;
          },
          error: (err) => {
            console.log('Error al consultar wallet:', err);
            if (err.status === 404) {
              this.createWallet();
            } else {
              this.createWallet();
            }
          },
        });
      }
    
      createWallet(): void {
        const newWallet: CreateWallet = { ownerType: 'user', ownerId: this.session.id };
    
        this._walletService.createWallet(newWallet).subscribe({
          next: (res) => {
            this.loadWallet();
            this.alertStore.addAlert({
              message: 'Wallet creada correctamente',
              type: 'success',
            });
          },
          error: (err) => {
            this.alertStore.addAlert({
              message: err.error?.message || err.error?.mensaje || 'Error al crear la wallet',
              type: 'error',
            });
          },
        });
      }

  loadMyAds() {
    this._adsService.getMyAds(this.session.id).subscribe({
      next: (ads) => {
        this.myAds = ads;
        this.filteredAds = [...ads];
      },
      error: (err) => {
        const msgDefault = `Error al obtener los anuncios.`;
        this.HandlerError.handleError(err, this.alertStore, msgDefault);
      },
    });
  }

  openAdDetailsModal(ad: Ad) {
    this.selectedAd = ad;
    
    if (ad.targetType === 'VIDEO' && this.isYouTubeUrl(ad.videoUrl)) {
      const embedUrl = this.convertYouTubeUrl(ad.videoUrl);
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    } else {
      this.safeVideoUrl = null;
    }
    
    this.adDetailsModal.nativeElement.showModal();
  }

  convertYouTubeUrl(url: string): string {
    if (!url) return '';
    
    let videoId = '';
    
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    else if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    }
    else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1].split('?')[0];
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }

  isYouTubeUrl(url: string): boolean {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  onVideoError(event: Event) {
    console.error('Error al cargar el video');
  }

  getAdTypeLabel(type: string): string {
    const types: Record<string, string> = {
      'TEXT': 'Solo Texto',
      'TEXT_IMAGE': 'Texto e Imagen',
      'VIDEO': 'Video'
    };
    return types[type] || type;
  }

  getStatusLabel(status: string): string {
    const statuses: Record<string, string> = {
      'PENDING_PAYMENT': 'Pendiente de Pago',
      'ACTIVE': 'Activo',
      'REJECTED': 'Rechazado',
      'EXPIRED': 'Expirado'
    };
    return statuses[status] || status;
  }

  getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      'PENDING_PAYMENT': 'badge-warning',
      'ACTIVE': 'badge-success',
      'REJECTED': 'badge-error',
      'EXPIRED': 'badge-ghost'
    };
    return classes[status] || 'badge-ghost';
  }

  getStatusIcon(status: string) {
    const icons: Record<string, any> = {
      'PENDING_PAYMENT': this.DollarSign,
      'ACTIVE': this.CheckCircle,
      'REJECTED': this.XCircle,
      'EXPIRED': this.Clock
    };
    return icons[status] || this.AlertCircle;
  }

  closeAdDetailsModal() {
    this.adDetailsModal.nativeElement.close();
    this.selectedAd = null;
    this.safeVideoUrl = null;
  }

  desactived(ad:Ad){
    this._adsService.expiredAd(ad.id).subscribe({
      next: (response)=>{
       this.loadMyAds()
       this.alertStore.addAlert({
          message: 'Se desactivo el anuncio correctamente.',
          type: 'success',
        });
      },
      error: (err) => {
        const msgDefault = `Error al actualizar los anuncios.`;
        this.HandlerError.handleError(err, this.alertStore, msgDefault);
      },
    })
  }
  filterAds() {
    if (!this.selectedStatus) {
      this.filteredAds = [...this.myAds];
    } else {
      this.filteredAds = this.myAds.filter(ad => ad.adStatus === this.selectedStatus);
    }
  }

  retryAdPayment(adId: string): void {
    this._adsService.retryPayment(adId, this.wallet.id).subscribe({
      next: (ad) => {
        this.alertStore.addAlert({
          message: 'Pago procesado. El anuncio será activado si los fondos son suficientes.',
          type: 'success',
        });
       this.loadMyAds()
      },
      error: (err) => {
        this.alertStore.addAlert({
          message: err.error?.message || 'Error al procesar el pago. Inténtalo de nuevo.',
          type: 'error',
        });
      }
    });
  }
}