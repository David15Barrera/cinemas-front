import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ad, AdsTargetType, AdsStatus, AdReport } from 'app/modules/ADVERTISER/models/ad.interface';
import { AdsService } from 'app/modules/ADVERTISER/services/ads.service';
import { AlertStore } from 'app/store/alert.store';
import { LucideAngularModule, Filter, X, Calendar, FileText, Image, Video, DollarSign, Clock, AlertCircle, Download } from 'lucide-angular';
import { Session } from 'app/modules/session/models/auth';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { ColumnDefinition, CompanyInfo, generateReportPDF } from 'app/utils/pdf-generator.utils';

@Component({
  selector: 'app-report-ads',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './report-ads.component.html',
  styleUrl: './report-ads.component.css'
})
export class ReportAdsComponent implements OnInit {
  private readonly _adsService = inject(AdsService);
  private readonly _alertStore = inject(AlertStore);
  private readonly _localStorageService = inject(LocalStorageService)

  Filter = Filter;
  X = X;
  Calendar = Calendar;
  FileText = FileText;
  Image = Image;
  Video = Video;
  DollarSign = DollarSign;
  Clock = Clock;
  AlertCircle = AlertCircle;
  Download = Download;

  ads: AdReport[] = [];
  filteredAds: AdReport[] = [];
  showFilters = false;

  filters = {
    adType: '',
    status: '',
    startDate: '',
    endDate: ''
  };

  session: Session = this._localStorageService.getState().session;

  adTypes = [
    { value: AdsTargetType.TEXT, label: 'Texto' },
    { value: AdsTargetType.TEXT_IMAGE, label: 'Texto con Imagen' },
    { value: AdsTargetType.VIDEO, label: 'Video' }
  ];

  statusOptions = [
    { value: AdsStatus.PENDING_PAYMENT, label: 'Pendiente de Pago' },
    { value: AdsStatus.ACTIVE, label: 'Activo' },
    { value: AdsStatus.EXPIRED, label: 'Expirado' },
    { value: AdsStatus.REJECTED, label: 'Rechazado' }
  ];

  ngOnInit(): void {
    this.loadAllAds();
  }

  loadAllAds() {
    this._adsService.getAllAds().subscribe({
      next: (response) => {
        this.ads = response;
        this.filteredAds = [...this.ads];
        console.log(this.ads);
      },
      error: (err) => {
        this._alertStore.addAlert({
          message: err.error.message,
          type: 'error'
        });
      }
    });
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  applyFilters() {
    this.filteredAds = this.ads.filter(ad => {
      const hasTypeFilter = this.filters.adType?.trim();
      if (hasTypeFilter && ad.adType !== this.filters.adType) {
        return false;
      }

      const hasStatusFilter = this.filters.status?.trim();
      if (hasStatusFilter && ad.status !== this.filters.status) {
        return false;
      }

      const hasStartDateFilter = this.filters.startDate?.trim();
      if (hasStartDateFilter && ad.startDate) {
        const adStartDate = new Date(ad.startDate);
        const filterStartDate = new Date(this.filters.startDate);
        adStartDate.setHours(0, 0, 0, 0);
        filterStartDate.setHours(0, 0, 0, 0);
        
        if (adStartDate < filterStartDate) {
          return false;
        }
      }

      const hasEndDateFilter = this.filters.endDate?.trim();
      if (hasEndDateFilter && ad.endDate) {
        const adEndDate = new Date(ad.endDate);
        const filterEndDate = new Date(this.filters.endDate);
        adEndDate.setHours(0, 0, 0, 0);
        filterEndDate.setHours(0, 0, 0, 0);
        
        if (adEndDate > filterEndDate) {
          return false;
        }
      }

      return true;
    });
  }

  clearFilters() {
    this.filters = {
      adType: '',
      status: '',
      startDate: '',
      endDate: ''
    };
    this.filteredAds = [...this.ads];
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.adType || this.filters.status || this.filters.startDate || this.filters.endDate);
  }

  getAdTypeLabel(targetType: AdsTargetType): string {
    const type = this.adTypes.find(t => t.value === targetType);
    return type ? type.label : targetType;
  }

  getStatusLabel(status: AdsStatus): string {
    const statusOption = this.statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.label : status;
  }

  getStatusClass(status: AdsStatus): string {
    switch (status) {
      case AdsStatus.ACTIVE:
        return 'badge-success';
      case AdsStatus.PENDING_PAYMENT:
        return 'badge-warning';
      case AdsStatus.EXPIRED:
        return 'badge-error';
      case AdsStatus.REJECTED:
        return 'badge-error';
      default:
        return 'badge-ghost';
    }
  }

  getTotalCost(): number {
    return this.filteredAds.reduce((sum, ad) => sum + (ad.totalCost || 0), 0);
  }

  getAdsCount(): number {
    return this.filteredAds.length;
  }

  async exportToPDF() {
    try {
      const columns: ColumnDefinition<any>[] = [
        { header: 'Tipo', field: 'tipo' },
        { header: 'Contenido', field: 'contenido' },
        { header: 'Estado', field: 'estado' },
        { header: 'Fecha Inicio', field: 'fechaInicio' },
        { header: 'Fecha Fin', field: 'fechaFin' },
        { header: 'Costo (Q)', field: 'costo' }
      ];

      const dataForPDF = this.filteredAds.map(ad => ({
        tipo: this.getAdTypeLabel(ad.adType),
        contenido: this.truncateText(ad.content || 'Sin contenido', 50),
        estado: this.getStatusLabel(ad.status),
        fechaInicio: ad.startDate ? new Date(ad.startDate).toLocaleDateString('es-GT') : 'N/A',
        fechaFin: ad.endDate ? new Date(ad.endDate).toLocaleDateString('es-GT') : 'N/A',
        costo: ad.totalCost.toFixed(2)
      }));

      const companyInfo: CompanyInfo = {
        companyName: 'Code ‘n Bugs',
        companyAddress: 'Ciudad',
        companyPhoneNumber: '5445 0614'
      };

      const footerFields = [
        { label: 'Total de Anuncios', value: this.getAdsCount(), isCurrency: false },
        { label: 'Costo Total', value: this.getTotalCost(), isCurrency: true }
      ];

      await generateReportPDF(
        columns,
        dataForPDF,
        companyInfo,
        'Q', 
        new Date(), 
        this.session.fullName,
        footerFields
      );

      this._alertStore.addAlert({
        message: "Reporte Exportado Correctamente",
        type: "success"
      });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      this._alertStore.addAlert({
        message: "Error al exportar",
        type: "error"
      });
    }
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }
}