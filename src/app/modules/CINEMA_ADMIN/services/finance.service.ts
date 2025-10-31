import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiConfigService } from '@shared/services/api-config.service';
import { Observable } from 'rxjs';
import {
  CreateWallet,
  DebitWallet,
  RechargeWallet,
  Transaction,
  Wallet,
} from '../models/finance.interface';
import { NewPayCinema, PayCinema } from '../models/payCinema.interface';

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  private readonly _http = inject(HttpClient);
  private readonly apiConfig = inject(ApiConfigService);
  private readonly API_WALLET = this.apiConfig.API_WALLET;
  private readonly API_TRANSACTIONS = this.apiConfig.API_TRANSACTIONS;
  private readonly API_CINEMA_PAYMENTS = this.apiConfig.API_CINEMA_PAYMENTS;

  constructor() {}

  createWallet(wallet: CreateWallet): Observable<void> {
    return this._http.post<void>(`${this.API_WALLET}`, wallet);
  }

  findWalletByOwnerId(ownerId: string): Observable<Wallet> {
    return this._http.get<Wallet>(`${this.API_WALLET}/owner/${ownerId}`);
  }

  rechargeWallet(recharge: RechargeWallet): Observable<void> {
    return this._http.post<void>(`${this.API_WALLET}/recharge`, recharge);
  }

  // debitWallet(debit: DebitWallet): Observable<void> {
  //   return this._http.post<void>(`${this.API_WALLET}/debit`, debit);
  // }

  getAllTransactionsByWalletId(walletId: string): Observable<Transaction[]> {
    return this._http.get<Transaction[]>(
      `${this.API_TRANSACTIONS}/wallet/${walletId}`
    );
  }

  // pago a cestancia cinema y get pagos
  createCinemaPayment(payCinema: NewPayCinema): Observable<void> {
    return this._http.post<void>(`${this.API_CINEMA_PAYMENTS}`, payCinema);
  }


  getAllPaymentsByCinemaId(cinemaId: string): Observable<PayCinema[]> {
    return this._http.get<PayCinema[]>(
      `${this.API_CINEMA_PAYMENTS}/cinema/${cinemaId}`
    );
  }
}
