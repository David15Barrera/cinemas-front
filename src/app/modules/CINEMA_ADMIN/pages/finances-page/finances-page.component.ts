import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { CinemaService } from '../../services/cinema.service';
import { FinanceService } from '../../services/finance.service';
import {
  CreateWallet,
  Transaction,
  Wallet,
  RechargeWallet,
  DebitWallet,
} from '../../models/finance.interface';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Session } from 'app/modules/session/models/auth';
import { AlertStore } from 'app/store/alert.store';
import { HandlerError } from '@shared/utils/handlerError';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Wallet as WalletIcon,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  Home,
  Clock,
  ArrowUpCircle,
  ArrowDownCircle,
  Filter,
  X,
  LucideAngularModule,
} from 'lucide-angular';
import { Cinema } from '../../models/cinema.interface';

@Component({
  selector: 'app-finances-page',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './finances-page.component.html',
})
export class FinancesPageComponent {
  // Lucide icons
  readonly WalletIcon = WalletIcon;
  readonly Plus = Plus;
  readonly TrendingUp = TrendingUp;
  readonly TrendingDown = TrendingDown;
  readonly Calendar = Calendar;
  readonly DollarSign = DollarSign;
  readonly CreditCard = CreditCard;
  readonly AlertCircle = AlertCircle;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly Home = Home;
  readonly Clock = Clock;
  readonly ArrowUpCircle = ArrowUpCircle;
  readonly ArrowDownCircle = ArrowDownCircle;
  readonly Filter = Filter;
  readonly X = X;
  // referencias a modales (pago por bloqueo de anuncios, recarga de saldo, pago por estadia de cine)
  @ViewChild('modalRecharge') modalRecharge!: ElementRef<HTMLDialogElement>;
  @ViewChild('modalPayStay') modalPayStay!: ElementRef<HTMLDialogElement>;

  // injeccion de dependencias
  private readonly cinemaService = inject(CinemaService);
  private readonly financesService = inject(FinanceService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly alertStore = inject(AlertStore);
  private HandlerError = HandlerError;

  // logica de la pagina
  transactions = signal<Transaction[]>([]);
  wallet = signal<Wallet | null>(null);
  existWallet = signal<boolean>(false);
  cinemaId = signal<string>('');
  cinema = signal<Cinema | null>(null);

  // datos para recargas
  rechargeAmount = signal<number>(0);

  // datos para pago de estancia
  payStayStartDate = signal<string>('');
  payStayEndDate = signal<string>('');
  payStayAmount = signal<number>(0);

  session: Session = this.localStorageService.getState().session;

  ngOnInit(): void {
    this.cinemaService.clearCinema();
    this.loadCinema();
  }

  loadCinema() {
    this.cinemaService.getCinemaByAdminUserId(this.session.id).subscribe({
      next: (cinema) => {
        if (cinema) {
          this.cinema.set(cinema);
          this.cinemaId.set(cinema.id);
          this.loadWalletByCinemaId(cinema.id);
        }
      },
    });
  }

  loadWalletByCinemaId(cinemaId: string) {
    this.financesService.findWalletByOwnerId(cinemaId).subscribe({
      next: (wallet) => {
        this.existWallet.set(true);
        this.wallet.set(wallet);
        this.loadTransactions(wallet.id);
      },
      error: (err) => {
        this.alertStore.addAlert({
          message:
            'Aun no tiene una cartera digital asignada, por favor cree una.',
          type: 'warning',
        });
        this.existWallet.set(false);
        console.error('Error loading wallet:', err);
      },
    });
  }

  loadTransactions(walletId: string) {
    this.financesService.getAllTransactionsByWalletId(walletId).subscribe({
      next: (transactions) => {
        this.transactions.set(transactions);
      },
    });
  }

  createWallet() {
    if (this.existWallet()) {
      this.alertStore.addAlert({
        message:
          'El cine ya tiene una cartera digital asignada, actualice la pagina.',
        type: 'warning',
      });
      return;
    }

    const walletData: CreateWallet = {
      ownerType: 'cinema',
      ownerId: this.cinemaId(),
    };

    this.financesService.createWallet(walletData).subscribe({
      next: (wallet) => {
        this.existWallet.set(true);
        this.alertStore.addAlert({
          message: 'Cartera digital creada exitosamente.',
          type: 'success',
        });
        this.cinemaService.clearCinema();
        this.loadCinema();
      },
      error: (err) => {
        const msgDefault = 'Error al crear la cartera digital.';
        this.HandlerError.handleError(err, this.alertStore, msgDefault);
      },
    });
  }

  // Modal de recarga
  openModalRecharge() {
    this.rechargeAmount.set(0);
    this.modalRecharge.nativeElement.showModal();
  }

  closeModalRecharge() {
    this.rechargeAmount.set(0);
    this.modalRecharge.nativeElement.close();
  }

  rechargeWallet() {
    if (this.rechargeAmount() <= 0) {
      this.alertStore.addAlert({
        message: 'El monto debe ser mayor a 0.',
        type: 'error',
      });
      return;
    }

    const rechargeData: RechargeWallet = {
      walletId: this.wallet()!.id,
      amount: this.rechargeAmount(),
    };

    this.financesService.rechargeWallet(rechargeData).subscribe({
      next: () => {
        this.alertStore.addAlert({
          message: 'Recarga realizada exitosamente.',
          type: 'success',
        });
        this.closeModalRecharge();
        this.loadWalletByCinemaId(this.cinemaId());
      },
      error: (err) => {
        const msgDefault = 'Error al recargar la cartera.';
        this.HandlerError.handleError(err, this.alertStore, msgDefault);
      },
    });
  }

  // Modal de pago de estancia
  openModalPayStay() {
    // Calcular la fecha de inicio automáticamente
    const startDate = this.getPayStayStartDate();
    this.payStayStartDate.set(startDate);
    this.payStayEndDate.set('');
    this.payStayAmount.set(0);
    this.modalPayStay.nativeElement.showModal();
  }

  closeModalPayStay() {
    this.payStayStartDate.set('');
    this.payStayEndDate.set('');
    this.payStayAmount.set(0);
    this.modalPayStay.nativeElement.close();
  }

  getPayStayStartDate(): string {
    // Filtrar transacciones de tipo debit_cinema
    const cinemaDebits = this.transactions().filter(
      (t) => t.transactionType === 'debit_cinema'
    );

    if (cinemaDebits.length === 0) {
      // Primer pago: usar fecha de creación del cine
      if (this.cinema()?.createdAt) {
        const createdDate = new Date(this.cinema()!.createdAt!);
        return createdDate.toISOString().split('T')[0];
      }
      return new Date().toISOString().split('T')[0];
    } else {
      // Ya hay pagos: usar la última fecha de pago
      const sortedDebits = cinemaDebits.sort(
        (a, b) =>
          new Date(b.transactionDate).getTime() -
          new Date(a.transactionDate).getTime()
      );
      const lastPaymentDate = new Date(sortedDebits[0].transactionDate);
      return lastPaymentDate.toISOString().split('T')[0];
    }
  }

  getMinEndDate(): string {
    // La fecha mínima de fin es un día después de la fecha de inicio
    if (!this.payStayStartDate()) return '';

    const startDate = new Date(this.payStayStartDate());
    startDate.setDate(startDate.getDate() + 1);
    return startDate.toISOString().split('T')[0];
  }

  calculatePayStayAmount() {
    if (!this.payStayStartDate() || !this.payStayEndDate()) {
      this.payStayAmount.set(0);
      return;
    }

    const startDate = new Date(this.payStayStartDate());
    const endDate = new Date(this.payStayEndDate());

    // Validar que la fecha fin no sea menor o igual a la fecha inicio
    if (endDate <= startDate) {
      this.alertStore.addAlert({
        message: 'La fecha fin debe ser mayor a la fecha de inicio.',
        type: 'error',
      });
      this.payStayAmount.set(0);
      return;
    }

    // Calcular días (excluyendo el día de inicio ya que ya fue pagado)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const dailyCost = this.cinema()?.dailyCost || 0;
    this.payStayAmount.set(diffDays * dailyCost);
  }

  hasOverlappingPayments(): boolean {
    if (!this.payStayStartDate() || !this.payStayEndDate()) {
      return false;
    }

    const startDate = new Date(this.payStayStartDate());
    const endDate = new Date(this.payStayEndDate());

    // Filtrar transacciones de tipo debit_cinema
    const cinemaDebits = this.transactions().filter(
      (t) => t.transactionType === 'debit_cinema'
    );

    // Verificar si hay traslape con alguna transacción existente
    // (excluyendo la fecha de inicio porque ya está cubierta por el pago anterior)
    for (const transaction of cinemaDebits) {
      const transactionDate = new Date(transaction.transactionDate);

      // Verificar traslape: la fecha de la transacción está entre inicio (exclusivo) y fin (inclusivo)
      if (transactionDate > startDate && transactionDate <= endDate) {
        return true;
      }
    }

    return false;
  }

  payStay() {
    // Validaciones
    if (!this.payStayStartDate() || !this.payStayEndDate()) {
      this.alertStore.addAlert({
        message: 'Debe seleccionar la fecha de fin.',
        type: 'error',
      });
      return;
    }

    const startDate = new Date(this.payStayStartDate());
    const endDate = new Date(this.payStayEndDate());

    // Validar que la fecha fin sea mayor a la fecha inicio (no puede ser igual)
    if (endDate <= startDate) {
      this.alertStore.addAlert({
        message:
          'La fecha fin debe ser al menos un día después de la fecha de inicio.',
        type: 'error',
      });
      return;
    }

    // Calcular monto
    this.calculatePayStayAmount();

    if (this.payStayAmount() <= 0) {
      this.alertStore.addAlert({
        message: 'El monto a pagar debe ser mayor a 0.',
        type: 'error',
      });
      return;
    }

    // Validar que tenga saldo suficiente
    if (this.wallet()!.balance < this.payStayAmount()) {
      this.alertStore.addAlert({
        message: 'No tiene saldo suficiente para realizar el pago.',
        type: 'error',
      });
      return;
    }

    // Validar traslapes
    if (this.hasOverlappingPayments()) {
      this.alertStore.addAlert({
        message:
          'Ya existe un pago en el rango de fechas seleccionado. Por favor, verifique las transacciones.',
        type: 'error',
      });
      return;
    }

    // Realizar el pago
    const debitData: DebitWallet = {
      walletId: this.wallet()!.id,
      amount: this.payStayAmount(),
      typeTransaction: 'debit_cinema',
    };

    this.financesService.debitWallet(debitData).subscribe({
      next: () => {
        this.alertStore.addAlert({
          message: 'Pago de estancia realizado exitosamente.',
          type: 'success',
        });
        this.closeModalPayStay();
        this.loadWalletByCinemaId(this.cinemaId());
      },
      error: (err) => {
        const msgDefault = 'Error al realizar el pago de estancia.';
        this.HandlerError.handleError(err, this.alertStore, msgDefault);
      },
    });
  }
  getTransactionIcon(type: string) {
    switch (type) {
      case 'recharge':
        return this.ArrowUpCircle;
      case 'debit_cinema':
        return this.Home;
      case 'debit_ticket':
      case 'debit_snack':
      case 'debit_ad':
      case 'debit_ad_block':
      case 'other':
        return this.ArrowDownCircle;
      default:
        return this.DollarSign;
    }
  }

  getTransactionTypeLabel(type: string): string {
    switch (type) {
      case 'recharge':
        return 'Recarga';
      case 'debit_ticket':
        return 'Débito - Boleto';
      case 'debit_snack':
        return 'Débito - Snack';
      case 'debit_ad':
        return 'Débito - Anuncio';
      case 'debit_ad_block':
        return 'Débito - Bloqueo Anuncio';
      case 'debit_cinema':
        return 'Pago Estancia';
      case 'other':
        return 'Otro';
      default:
        return 'Desconocido';
    }
  }

  isDebit(type: string): boolean {
    return type.startsWith('debit_') || type === 'other';
  }

  getRechargesCount(): number {
    return this.transactions().filter((t) => t.transactionType === 'recharge')
      .length;
  }

  getCinemaDebitsCount(): number {
    return this.transactions().filter(
      (t) => t.transactionType === 'debit_cinema'
    ).length;
  }

  getOtherDebitsCount(): number {
    return this.transactions().filter(
      (t) =>
        t.transactionType !== 'recharge' && t.transactionType !== 'debit_cinema'
    ).length;
  }

  isFirstPayment(): boolean {
    return this.getCinemaDebitsCount() === 0;
  }
}
