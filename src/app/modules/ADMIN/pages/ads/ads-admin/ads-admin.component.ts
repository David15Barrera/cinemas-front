import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChargePeriod } from 'app/modules/ADMIN/models/adsCost.interface';
import { costadsService } from 'app/modules/ADMIN/services/costAds.service';
import { finalize } from 'rxjs';

export const ADS_TYPES = {
    TEXT: 'TEXT',
    VIDEO: 'VIDEO',
    TEXT_IMAGE: 'TEXT_IMAGE',
} as const;

type AdType = keyof typeof ADS_TYPES;

@Component({
  selector: 'app-ads-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './ads-admin.component.html',
  styleUrl: './ads-admin.component.css'
})
export class AdsAdminComponent implements OnInit {
private readonly costadsService = inject(costadsService);

  textCharge?: ChargePeriod;
  videoCharge?: ChargePeriod;
  textImageCharge?: ChargePeriod;

  textCostInput: number = 0;
  textDaysInput: number = 0;

  videoCostInput: number = 0;
  videoDaysInput: number = 0;

  textImageCostInput: number = 0;
  textImageDaysInput: number = 0;

  isSavingText: boolean = false;
  isSavingVideo: boolean = false;
  isSavingTextImage: boolean = false;

  readonly ADS_TYPES = ADS_TYPES; // Exponemos las constantes al template

  constructor() { } 

  ngOnInit(): void {
    this.loadAllCharges();
  }

  loadAllCharges() {
    this.costadsService.getChargePerText().subscribe(res => {
      this.textCharge = res;
      this.textCostInput = res.cost;
      this.textDaysInput = res.durationDays;
    }, err => console.error('Error cargando Configuración de Texto', err));

    this.costadsService.getChargePerVideo().subscribe(res => {
      this.videoCharge = res;
      this.videoCostInput = res.cost;
      this.videoDaysInput = res.durationDays;
    }, err => console.error('Error cargando Configuración de Video', err));

    this.costadsService.getChargePerTextVideo().subscribe(res => {
      this.textImageCharge = res;
      this.textImageCostInput = res.cost;
      this.textImageDaysInput = res.durationDays;
    }, err => console.error('Error cargando Configuración de Texto/Video', err));
  }

  saveCharge(type: AdType) {
    let currentCharge: ChargePeriod | undefined;
    let costInput: number;
    let daysInput: number;
    let savingFlag: keyof AdsAdminComponent;

    switch (type) {
      case ADS_TYPES.TEXT:
        currentCharge = this.textCharge;
        costInput = this.textCostInput;
        daysInput = this.textDaysInput;
        savingFlag = 'isSavingText';
        break;
      case ADS_TYPES.VIDEO:
        currentCharge = this.videoCharge;
        costInput = this.videoCostInput;
        daysInput = this.videoDaysInput;
        savingFlag = 'isSavingVideo';
        break;
      case ADS_TYPES.TEXT_IMAGE:
        currentCharge = this.textImageCharge;
        costInput = this.textImageCostInput;
        daysInput = this.textImageDaysInput;
        savingFlag = 'isSavingTextImage';
        break;
      default:
        console.error('Tipo de anuncio inválido:', type);
        return;
    }

    if (!currentCharge || !currentCharge.id) {
      alert(`Error: El registro de ${type} no tiene un ID válido para actualizar.`);
      return;
    }
    
    if (costInput <= 0 || daysInput <= 0) {
      alert('El costo y la duración en días deben ser mayores a cero.');
      return;
    }

    (this[savingFlag] as boolean) = true;

    const updatedCharge: ChargePeriod = {
      ...currentCharge,
      cost: costInput,
      durationDays: daysInput,
      targetType: type // Asegura que el tipo se mantenga
    };

    this.costadsService.updateChargePeriod(currentCharge.id as string, updatedCharge).pipe(
      finalize(() => (this[savingFlag] as boolean) = false)
    ).subscribe({
      next: (res) => {
        switch (type) {
          case ADS_TYPES.TEXT: this.textCharge = res; break;
          case ADS_TYPES.VIDEO: this.videoCharge = res; break;
          case ADS_TYPES.TEXT_IMAGE: this.textImageCharge = res; break;
        }
        alert(`Configuración de ${type} actualizada correctamente!`);
      },
      error: (err) => {
        console.error(`Error actualizando costo de ${type}`, err);
        alert(`Error al actualizar el costo de ${type}. Verifique la consola.`);
      }
    });
  }

  resetInput(type: AdType) {
    switch (type) {
      case ADS_TYPES.TEXT:
        this.textCostInput = this.textCharge?.cost || 0;
        this.textDaysInput = this.textCharge?.durationDays || 0;
        break;
      case ADS_TYPES.VIDEO:
        this.videoCostInput = this.videoCharge?.cost || 0;
        this.videoDaysInput = this.videoCharge?.durationDays || 0;
        break;
      case ADS_TYPES.TEXT_IMAGE:
        this.textImageCostInput = this.textImageCharge?.cost || 0;
        this.textImageDaysInput = this.textImageCharge?.durationDays || 0;
        break;
    }
  }
}