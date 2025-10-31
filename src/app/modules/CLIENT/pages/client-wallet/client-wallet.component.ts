import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { CreateWallet, Wallet, RechargeWallet } from 'app/modules/CINEMA_ADMIN/models/finance.interface';
import { FinanceService } from 'app/modules/CINEMA_ADMIN/services/finance.service';
import { Session } from 'app/modules/session/models/auth';
import { AlertStore } from 'app/store/alert.store';
import { ArrowLeft, Loader2, LucideAngularModule, PlusCircle } from 'lucide-angular';

@Component({
  selector: 'app-client-wallet',
  imports: [FormsModule, CurrencyPipe, CommonModule, LucideAngularModule],
  templateUrl: './client-wallet.component.html',
  styleUrl: './client-wallet.component.css'
})
export class ClientWalletComponent implements OnInit {

  private readonly _walletService = inject(FinanceService);
  private readonly _localStorageService = inject(LocalStorageService);
  private readonly _alertStore = inject(AlertStore);

  session: Session = this._localStorageService.getState().session;
  wallet!: Wallet;
  userId!: string;

  rechargeAmount: number = 0;

  ArrowLeft = ArrowLeft;
  Loader2 = Loader2;
  PlusCircle = PlusCircle;

  ngOnInit(): void {
    this.userId = this.session.id;
    this.loadWallet();
  }

  loadWallet(): void {
    this._walletService.findWalletByOwnerId(this.userId).subscribe({
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
    const newWallet: CreateWallet = { ownerType: 'user', ownerId: this.userId };

    this._walletService.createWallet(newWallet).subscribe({
      next: (res) => {
        console.log('Wallet creada con éxito:', res);
        this.loadWallet();
        this._alertStore.addAlert({
          message: 'Wallet creada correctamente',
          type: 'success',
        });
      },
      error: (err) => {
        console.log('Error al crear wallet:', err);
        this._alertStore.addAlert({
          message: err.error?.message || err.error?.mensaje || 'Error al crear la wallet',
          type: 'error',
        });
      },
    });
  }

  rechargeWallet(): void {
    if (!this.wallet) {
      this._alertStore.addAlert({
        message: 'No se ha encontrado una wallet para recargar',
        type: 'error',
      });
      return;
    }

    if (this.rechargeAmount <= 0) {
      this._alertStore.addAlert({
        message: 'Por favor, ingresa un monto válido para recargar',
        type: 'error',
      });
      return;
    }

    const rechargeData: RechargeWallet = {
      walletId: this.wallet.id,
      amount: this.rechargeAmount,
    };

    this._walletService.rechargeWallet(rechargeData).subscribe({
      next: () => {
        this._alertStore.addAlert({
          message: `Se han añadido Q${this.rechargeAmount} correctamente a tu wallet`,
          type: 'success',
        });
        this.loadWallet();
        this.rechargeAmount = 0;
      },
      error: (err) => {
        console.log('Error al recargar wallet:', err);
        this._alertStore.addAlert({
          message: err.error?.message || err.error?.mensaje || 'Error al recargar la wallet',
          type: 'error',
        });
      },
    });
  }
}
