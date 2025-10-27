import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdsService } from '../../services/ads.service';
import { Session } from 'app/modules/session/models/auth';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Ad } from '../../models/ad.interface';
import { HandlerError } from '@shared/utils/handlerError';
import { AlertStore } from 'app/store/alert.store';
import { LucideAngularModule, Clock, Tag, Calendar, CheckCircle, XCircle, AlertCircle, DollarSign } from 'lucide-angular';

@Component({
  selector: 'app-myads',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './myads.component.html',
  styleUrl: './myads.component.css'
})
export class MyadsComponent implements OnInit {

  myAds: Ad[] = [];
  
  Clock = Clock;
  Tag = Tag;
  Calendar = Calendar;
  CheckCircle = CheckCircle;
  XCircle = XCircle;
  AlertCircle = AlertCircle;
  DollarSign = DollarSign;

  private readonly _adsService = inject(AdsService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly alertStore = inject(AlertStore);

  session: Session = this.localStorageService.getState().session;

  private HandlerError = HandlerError;
  
  constructor() {}

  ngOnInit(): void {
    this.loadMyAds();
  }

  loadMyAds() {
    this._adsService.getMyAds(this.session.id).subscribe({
      next: (ads) => {
        this.myAds = ads;
        console.log(this.myAds);
      },
      error: (err) => {
        const msgDefault = `Error al obtener los anuncios.`;
        this.HandlerError.handleError(err, this.alertStore, msgDefault);
      },
    });
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
}