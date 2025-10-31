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
  Ban,
  Eye,
  History,
  LucideAngularModule,
} from 'lucide-angular';
import { Cinema } from '../../models/cinema.interface';
import { NewPayCinema, PayCinema } from '../../models/payCinema.interface';
import { BlockAdsService } from '../../services/block-ads.service';
import { BlockAd, NewBlockAd } from '../../models/block-ads.interface';

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
  readonly Ban = Ban;
  readonly Eye = Eye;
  readonly History = History;

  // referencias a modales
  @ViewChild('modalRecharge') modalRecharge!: ElementRef<HTMLDialogElement>;
  @ViewChild('modalPayStay') modalPayStay!: ElementRef<HTMLDialogElement>;
  @ViewChild('modalPayAdBlock')
  modalPayAdBlock!: ElementRef<HTMLDialogElement>;
  @ViewChild('modalHistoryStay')
  modalHistoryStay!: ElementRef<HTMLDialogElement>;
  @ViewChild('modalHistoryAdBlock')
  modalHistoryAdBlock!: ElementRef<HTMLDialogElement>;

  // injeccion de dependencias
  private readonly cinemaService = inject(CinemaService);
  private readonly financesService = inject(FinanceService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly adBlockService = inject(BlockAdsService);
  private readonly alertStore = inject(AlertStore);
  private HandlerError = HandlerError;

  // logica de la pagina
  transactions = signal<Transaction[]>([]);
  wallet = signal<Wallet | null>(null);
  existWallet = signal<boolean>(false);
  cinemaId = signal<string>('');
  cinema = signal<Cinema | null>(null);

  // datos para pago bloqueo de anuncios
  adBlocks = signal<BlockAd[]>([]);
  activeAdBlock = signal<BlockAd | null>(null);
  hasActiveAdBlock = signal<boolean>(false);
  adBlockStartDate = signal<string>('');
  adBlockEndDate = signal<string>('');
  adBlockAmount = signal<number>(0);
  adBlockDailyCost = signal<number>(50); // Costo por defecto, se actualiza desde el backend

  // datos para recargas
  rechargeAmount = signal<number>(0);

  // datos para pago de estancia
  payStayStartDate = signal<string>('');
  payStayEndDate = signal<string>('');
  payStayAmount = signal<number>(0);
  payCinemaList = signal<PayCinema[]>([]);

  session: Session = this.localStorageService.getState().session;

  ngOnInit(): void {
    this.cinemaService.clearCinema();
    this.loadCinema();
    this.loadAdBlockCost();
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
        this.loadCinemaPayments(cinemaId);
        this.loadAdBlocks(cinemaId);
        this.checkActiveAdBlock(cinemaId);
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

  loadCinemaPayments(cinemaId: string) {
    this.financesService.getAllPaymentsByCinemaId(cinemaId).subscribe({
      next: (payments) => {
        this.payCinemaList.set(payments);
      },
      error: (err) => {
        this.payCinemaList.set([]);
        console.error('Error al obtener los pagos:', err);
      },
    });
  }

  loadAdBlocks(cinemaId: string) {
    this.adBlockService.getAllAdBlocksByCinemaId(cinemaId).subscribe({
      next: (adBlocks) => {
        this.adBlocks.set(adBlocks);
      },
      error: (err) => {
        this.adBlocks.set([]);
        console.error('Error al obtener los bloqueos de anuncios:', err);
      },
    });
  }

  loadAdBlockCost() {
    this.adBlockService.getCostGlobal().subscribe({
      next: (costGlobal) => {
        this.adBlockDailyCost.set(costGlobal.cost);
      },
      error: (err) => {
        // Mantener valor por defecto en caso de error
        console.error('Error al obtener el costo de bloqueo de anuncios:', err);
        this.adBlockDailyCost.set(50);
      },
    });
  }

  checkActiveAdBlock(cinemaId: string) {
    this.adBlockService.getAdBlockActiveByCinemaId(cinemaId).subscribe({
      next: (activeBlock) => {
        this.activeAdBlock.set(activeBlock);
        this.hasActiveAdBlock.set(true);
      },
      error: (err) => {
        this.activeAdBlock.set(null);
        this.hasActiveAdBlock.set(false);
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
    // Usar la lista de pagos de cine en lugar de transacciones
    const cinemaPayments = this.payCinemaList();

    if (cinemaPayments.length === 0) {
      // Primer pago: usar fecha de creación del cine
      if (this.cinema()?.createdAt) {
        const createdDate = new Date(this.cinema()!.createdAt!);
        return createdDate.toISOString().split('T')[0];
      }
      return new Date().toISOString().split('T')[0];
    } else {
      // Ya hay pagos: usar la última fecha de pago (endDate)
      const sortedPayments = cinemaPayments.sort(
        (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
      );
      const lastPaymentEndDate = new Date(sortedPayments[0].endDate);
      return lastPaymentEndDate.toISOString().split('T')[0];
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

    // Usar la lista de pagos de cine
    const cinemaPayments = this.payCinemaList();

    // Verificar si hay traslape con algún pago existente
    // (excluyendo la fecha de inicio porque ya está cubierta por el pago anterior)
    for (const payment of cinemaPayments) {
      const paymentStart = new Date(payment.startDate);
      const paymentEnd = new Date(payment.endDate);

      // Verificar traslape: hay overlap si los rangos se intersectan
      // Excluimos el día de inicio del nuevo pago porque es el día final del último pago
      if (
        (paymentStart > startDate && paymentStart <= endDate) ||
        (paymentEnd > startDate && paymentEnd <= endDate) ||
        (paymentStart <= startDate && paymentEnd >= endDate)
      ) {
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
          'Ya existe un pago en el rango de fechas seleccionado. Por favor, verifique los pagos.',
        type: 'error',
      });
      return;
    }

    // Calcular la fecha de inicio real para el pago
    // Si NO es el primer pago, sumar un día a la fecha de inicio para evitar cobrar dos veces el mismo día
    const actualStartDate = new Date(this.payStayStartDate());
    if (!this.isFirstPayment()) {
      actualStartDate.setDate(actualStartDate.getDate() + 1);
    }

    // Crear el pago de estancia
    const newPayCinema: NewPayCinema = {
      cinemaId: this.cinemaId(),
      startDate: actualStartDate.toISOString().split('T')[0],
      endDate: this.payStayEndDate(),
    };

    this.financesService.createCinemaPayment(newPayCinema).subscribe({
      next: () => {
        this.alertStore.addAlert({
          message: 'Pago de estancia realizado exitosamente.',
          type: 'success',
        });
        this.closeModalPayStay();
        // Recargar wallet (se actualizará el balance), transacciones y pagos
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
    // Usar la lista de pagos de cine en lugar de transacciones
    return this.payCinemaList().length;
  }

  getOtherDebitsCount(): number {
    return this.transactions().filter(
      (t) =>
        t.transactionType !== 'recharge' && t.transactionType !== 'debit_cinema'
    ).length;
  }

  isFirstPayment(): boolean {
    return this.payCinemaList().length === 0;
  }

  // ============ MODALES DE HISTORIAL ============

  openModalHistoryStay() {
    this.modalHistoryStay.nativeElement.showModal();
  }

  closeModalHistoryStay() {
    this.modalHistoryStay.nativeElement.close();
  }

  openModalHistoryAdBlock() {
    this.modalHistoryAdBlock.nativeElement.showModal();
  }

  closeModalHistoryAdBlock() {
    this.modalHistoryAdBlock.nativeElement.close();
  }

  // ============ BLOQUEO DE ANUNCIOS ============

  openModalPayAdBlock() {
    const startDate = this.getAdBlockStartDate();
    this.adBlockStartDate.set(startDate);
    this.adBlockEndDate.set('');
    this.adBlockAmount.set(0);
    this.modalPayAdBlock.nativeElement.showModal();
  }

  closeModalPayAdBlock() {
    this.adBlockStartDate.set('');
    this.adBlockEndDate.set('');
    this.adBlockAmount.set(0);
    this.modalPayAdBlock.nativeElement.close();
  }

  getAdBlockStartDate(): string {
    const adBlockList = this.adBlocks();

    if (adBlockList.length === 0) {
      // Primer bloqueo: usar fecha actual
      return new Date().toISOString().split('T')[0];
    } else {
      // Filtrar solo bloqueos ACTIVOS o EXPIRADOS (bloques válidos que fueron/están activos)
      // Excluir: REJECTED y PENDING_PAYMENT
      const validBlocks = adBlockList.filter(
        (block) => block.adStatus === 'ACTIVE' || block.adStatus === 'EXPIRED'
      );

      if (validBlocks.length === 0) {
        // Si no hay bloqueos válidos, usar fecha actual
        return new Date().toISOString().split('T')[0];
      }

      // Ya hay bloqueos válidos: usar la última fecha de fin del bloqueo más reciente
      const sortedBlocks = validBlocks.sort(
        (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
      );
      const lastBlockEndDate = new Date(sortedBlocks[0].endDate);
      return lastBlockEndDate.toISOString().split('T')[0];
    }
  }

  getAdBlockMinEndDate(): string {
    if (!this.adBlockStartDate()) return '';

    const startDate = new Date(this.adBlockStartDate());
    startDate.setDate(startDate.getDate() + 1);
    return startDate.toISOString().split('T')[0];
  }

  calculateAdBlockAmount() {
    if (!this.adBlockStartDate() || !this.adBlockEndDate()) {
      this.adBlockAmount.set(0);
      return;
    }

    const startDate = new Date(this.adBlockStartDate());
    const endDate = new Date(this.adBlockEndDate());

    if (endDate <= startDate) {
      this.alertStore.addAlert({
        message: 'La fecha fin debe ser mayor a la fecha de inicio.',
        type: 'error',
      });
      this.adBlockAmount.set(0);
      return;
    }

    // Calcular días
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Usar el costo dinámico obtenido del backend
    const dailyCost = this.adBlockDailyCost();
    this.adBlockAmount.set(diffDays * dailyCost);
  }

  hasOverlappingAdBlocks(): boolean {
    if (!this.adBlockStartDate() || !this.adBlockEndDate()) {
      return false;
    }

    const startDate = new Date(this.adBlockStartDate());
    const endDate = new Date(this.adBlockEndDate());

    // Filtrar solo bloqueos ACTIVOS o EXPIRADOS para verificar traslapes
    // Excluir: REJECTED y PENDING_PAYMENT
    const validBlocks = this.adBlocks().filter(
      (block) => block.adStatus === 'ACTIVE' || block.adStatus === 'EXPIRED'
    );

    for (const block of validBlocks) {
      const blockStart = new Date(block.startDate);
      const blockEnd = new Date(block.endDate);

      if (
        (blockStart > startDate && blockStart <= endDate) ||
        (blockEnd > startDate && blockEnd <= endDate) ||
        (blockStart <= startDate && blockEnd >= endDate)
      ) {
        return true;
      }
    }

    return false;
  }

  isFirstAdBlock(): boolean {
    // Verificar si hay algún bloqueo ACTIVO o EXPIRADO (bloques válidos)
    // Excluir: REJECTED y PENDING_PAYMENT
    const validBlocks = this.adBlocks().filter(
      (block) => block.adStatus === 'ACTIVE' || block.adStatus === 'EXPIRED'
    );
    return validBlocks.length === 0;
  }

  payAdBlock() {
    // Validaciones
    if (!this.adBlockStartDate() || !this.adBlockEndDate()) {
      this.alertStore.addAlert({
        message: 'Debe seleccionar la fecha de fin.',
        type: 'error',
      });
      return;
    }

    const startDate = new Date(this.adBlockStartDate());
    const endDate = new Date(this.adBlockEndDate());

    if (endDate <= startDate) {
      this.alertStore.addAlert({
        message:
          'La fecha fin debe ser al menos un día después de la fecha de inicio.',
        type: 'error',
      });
      return;
    }

    // Calcular monto
    this.calculateAdBlockAmount();

    if (this.adBlockAmount() <= 0) {
      this.alertStore.addAlert({
        message: 'El monto a pagar debe ser mayor a 0.',
        type: 'error',
      });
      return;
    }

    // Validar saldo suficiente
    if (this.wallet()!.balance < this.adBlockAmount()) {
      this.alertStore.addAlert({
        message: 'No tiene saldo suficiente para realizar el pago.',
        type: 'error',
      });
      return;
    }

    // Validar traslapes
    if (this.hasOverlappingAdBlocks()) {
      this.alertStore.addAlert({
        message:
          'Ya existe un bloqueo en el rango de fechas seleccionado. Por favor, verifique los bloqueos.',
        type: 'error',
      });
      return;
    }

    // Calcular fecha de inicio real
    // Si NO es el primer bloqueo, sumar un día para evitar cobrar dos veces el mismo día
    const actualStartDate = new Date(this.adBlockStartDate());
    if (!this.isFirstAdBlock()) {
      actualStartDate.setDate(actualStartDate.getDate() + 1);
    }

    // Crear el bloqueo de anuncios
    const newAdBlock: NewBlockAd = {
      cinemaId: this.cinemaId(),
      startDate: actualStartDate.toISOString().split('T')[0],
      endDate: this.adBlockEndDate(),
      walletId: this.wallet()!.id,
    };

    this.adBlockService.createAdBlock(newAdBlock).subscribe({
      next: () => {
        this.alertStore.addAlert({
          message:
            'Bloqueo de anuncios solicitado exitosamente. Actualizando datos...',
          type: 'success',
        });
        this.closeModalPayAdBlock();

        // Recargar bloqueos inmediatamente para mostrar el nuevo registro
        this.loadAdBlocks(this.cinemaId());

        // Esperar 3 segundos para que el evento del backend procese el cobro
        // y actualice el wallet y las transacciones
        setTimeout(() => {
          this.loadWalletByCinemaId(this.cinemaId());
          this.alertStore.addAlert({
            message: 'Datos actualizados correctamente.',
            type: 'info',
          });
        }, 3000);
      },
      error: (err) => {
        const msgDefault = 'Error al realizar el bloqueo de anuncios.';
        this.HandlerError.handleError(err, this.alertStore, msgDefault);
      },
    });
  }

  getAdBlocksCount(): number {
    return this.adBlocks().length;
  }
}
