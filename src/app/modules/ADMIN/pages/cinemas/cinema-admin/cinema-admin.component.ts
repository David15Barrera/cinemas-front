import { Component, OnInit } from '@angular/core';
import { globalCostService } from 'app/modules/ADMIN/services/globalCost.service';
import { CostGlobalCinMed } from 'app/modules/ADMIN/models/costglobal.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-cinema-admin',
  imports: [FormsModule, CommonModule],
  templateUrl: './cinema-admin.component.html',
  styleUrl: './cinema-admin.component.css'
})
export class CinemaAdminComponent implements OnInit {

  // Costo Diario Cine
  globalCostCinema?: CostGlobalCinMed;
  costInputCinema: number = 0;
  isSavingCinema: boolean = false;
  readonly COST_TYPE_CINEMA: CostGlobalCinMed['typeCost'] = 'COST_PER_DAY_CINEMA';
  readonly COST_ID_CINEMA: string = 'cinema-cost-id';

  // Costo de Bloqueo de ADS
  globalCostAds?: CostGlobalCinMed;
  costInputAds: number = 0;
  isSavingAds: boolean = false;
  readonly COST_TYPE_ADS: CostGlobalCinMed['typeCost'] = 'AD_BLOCK';
  readonly COST_ID_ADS: string = 'ads-block-cost-id';


  constructor(private costService: globalCostService) {}

  ngOnInit(): void {
    this.loadGlobalCostCinema();
    this.loadGlobalCostAds();
  }

  // --- Cine--

  loadGlobalCostCinema() {
    this.costService.getGlobalCostCinema().subscribe({
      next: (res) => {
        this.globalCostCinema = res;
        this.costInputCinema = res.cost;
        console.log(' Costo Cine cargado:', res);
      },
      error: (err) => console.error('Error cargando costo diario de cine', err)
    });
  }

  saveCostCinema() {
    if (!this.costInputCinema || this.costInputCinema <= 0) {
        alert('Por favor, ingrese un costo válido mayor a cero para el Cine.');
        return;
    }
    
    this.isSavingCinema = true;
    const commonUpdate = (costToSave: CostGlobalCinMed) => {
        return this.costService.updateGlobalCost(costToSave.id, costToSave).pipe(
            finalize(() => this.isSavingCinema = false)
        );
    };

    const commonCreate = (costToSave: CostGlobalCinMed) => {
        return this.costService.createGlobalCost(costToSave).pipe(
            finalize(() => this.isSavingCinema = false)
        );
    };

    if (this.globalCostCinema) {
      const updatedCost: CostGlobalCinMed = { 
        ...this.globalCostCinema, 
        cost: this.costInputCinema,
        typeCost: this.COST_TYPE_CINEMA 
      };

      commonUpdate(updatedCost).subscribe({
        next: (res) => {
          this.globalCostCinema = res;
          alert('Costo Diario de Cine actualizado correctamente');
        },
        error: (err) => console.error('Error actualizando costo diario de cine', err)
      });
      
    } else {
      const newCost: CostGlobalCinMed = { 
        id: this.COST_ID_CINEMA,
        cost: this.costInputCinema,
        typeCost: this.COST_TYPE_CINEMA
      };

      commonCreate(newCost).subscribe({
        next: (res) => {
          this.globalCostCinema = res;
          alert('Costo Diario de Cine creado correctamente');
        },
        error: (err) => console.error('Error creando costo diario de cine', err)
      });
    }
  }

  resetInputCinema() {
    this.costInputCinema = this.globalCostCinema?.cost || 0;
  }

  // --- Bloqueo de ADS--

  loadGlobalCostAds() {
    this.costService.getGlobalCostAds().subscribe({
      next: (res) => {
        this.globalCostAds = res;
        this.costInputAds = res.cost;
        console.log(' Costo ADS cargado:', res);
      },
      error: (err) => console.error('Error cargando costo de bloqueo de ADS', err)
    });
  }

  saveCostAds() {
    if (!this.costInputAds || this.costInputAds <= 0) {
        alert('Por favor, ingrese un costo válido mayor a cero para Bloqueo de ADS.');
        return;
    }
    
    this.isSavingAds = true;

    const commonUpdate = (costToSave: CostGlobalCinMed) => {
        return this.costService.updateGlobalCost(costToSave.id, costToSave).pipe(
            finalize(() => this.isSavingAds = false)
        );
    };

    const commonCreate = (costToSave: CostGlobalCinMed) => {
        return this.costService.createGlobalCost(costToSave).pipe(
            finalize(() => this.isSavingAds = false)
        );
    };

    if (this.globalCostAds) {
      const updatedCost: CostGlobalCinMed = { 
        ...this.globalCostAds, 
        cost: this.costInputAds,
        typeCost: this.COST_TYPE_ADS 
      };

      commonUpdate(updatedCost).subscribe({
        next: (res) => {
          this.globalCostAds = res;
          alert('Costo de Bloqueo de ADS actualizado correctamente');
        },
        error: (err) => console.error('Error actualizando costo de bloqueo de ADS', err)
      });
      
    } else {
      const newCost: CostGlobalCinMed = { 
        id: this.COST_ID_ADS,
        cost: this.costInputAds,
        typeCost: this.COST_TYPE_ADS
      };

      commonCreate(newCost).subscribe({
        next: (res) => {
          this.globalCostAds = res;
          alert('Costo de Bloqueo de ADS creado correctamente');
        },
        error: (err) => console.error('Error creando costo de bloqueo de ADS', err)
      });
    }
  }

  resetInputAds() {
    this.costInputAds = this.globalCostAds?.cost || 0;
  }
}