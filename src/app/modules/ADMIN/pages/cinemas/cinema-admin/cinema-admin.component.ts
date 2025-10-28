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

  globalCost?: CostGlobalCinMed;
  costInput: number = 0;
  isSaving: boolean = false;

  readonly COST_TYPE: CostGlobalCinMed['typeCost'] = 'COST_PER_DAY_CINEMA';
  readonly COST_ID: string = 'cinema-cost-id'; 

  constructor(private costService: globalCostService) {}

  ngOnInit(): void {
    this.loadGlobalCost();
  }

loadGlobalCost() {
  this.costService.getGlobalCostCinema().subscribe({
    next: (res) => {
      this.globalCost = res;
      this.costInput = res.cost;
      console.log(' Costo cargado:', res);
    },
    error: (err) => console.error('Error cargando costo global', err)
  });
}



  saveCost() {
    if (!this.costInput || this.costInput <= 0) {
        alert('Por favor, ingrese un costo válido mayor a cero.');
        return;
    }
    
    this.isSaving = true;

    if (this.globalCost) {
      const updatedCost: CostGlobalCinMed = { 
        ...this.globalCost, 
        cost: this.costInput,
        typeCost: this.COST_TYPE 
      };

      this.costService.updateGlobalCost(this.globalCost.id, updatedCost).pipe(
        finalize(() => this.isSaving = false)
      ).subscribe({
        next: (res) => {
          this.globalCost = res;
          alert('Costo actualizado correctamente');
        },
        error: (err) => console.error('Error actualizando costo', err)
      });
      
    } else {
      const newCost: CostGlobalCinMed = { 
        id: this.COST_ID,
        cost: this.costInput,
        typeCost: this.COST_TYPE
      };

      this.costService.createGlobalCost(newCost).pipe(
        finalize(() => this.isSaving = false)
      ).subscribe({
        next: (res) => {
          this.globalCost = res;
          alert('Costo creado correctamente');
        },
        error: (err) => console.error('Error creando costo', err)
      });
    }
  }

  resetInput() {
    this.costInput = this.globalCost?.cost || 0;
  }
}
