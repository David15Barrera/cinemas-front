import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Snack } from 'app/modules/CINEMA_ADMIN/models/snack.interface';
import { CinemaService } from 'app/modules/CINEMA_ADMIN/services/cinema.service';
import { SnackService } from 'app/modules/CINEMA_ADMIN/services/snack.service';
import { AlertStore } from 'app/store/alert.store';
import { LucideAngularModule, ArrowLeft, ShoppingCart, Filter, X, Search, Plus, Minus, Trash2, Package, AlertCircle } from 'lucide-angular';
import { ImagePipe } from '@shared/pipes/image.pipe';

interface CartItem extends Snack {
  quantity: number;
  subtotal: number;
}

@Component({
  selector: 'app-buy-snacks',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ImagePipe],
  templateUrl: './buy-snacks.component.html',
  styleUrl: './buy-snacks.component.css'
})
export class BuySnacksComponent implements OnInit {

  private readonly _snacksService = inject(SnackService);
  private readonly _cinemaService = inject(CinemaService);
  private readonly _alertStore = inject(AlertStore);
  private readonly route = inject(ActivatedRoute);
  public readonly _router = inject(Router);

  ArrowLeft = ArrowLeft;
  ShoppingCart = ShoppingCart;
  Filter = Filter;
  X = X;
  Search = Search;
  Plus = Plus;
  Minus = Minus;
  Trash2 = Trash2;
  Package = Package;
  AlertCircle = AlertCircle;

  cinemaId!: string;
  cinemaName!: string;

  snacks: Snack[] = [];
  filteredSnacks: Snack[] = [];
  cart: CartItem[] = [];
  
  showFilters = false;
  searchText = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let id = params.get('id');
      if (id != null) {
        this.cinemaId = id;
        this.loadCinemaInfo();
        this.loadSnacks();
      }
    });
  }

  loadSnacks() {
    this._snacksService.getSnacksByCinemaId(this.cinemaId).subscribe({
      next: (response) => {
        this.snacks = response.filter(snack => snack.active);
        this.filteredSnacks = [...this.snacks];
        console.log("snacks", this.snacks);
      },
      error: (error) => {
        console.error('Error al cargar snacks:', error);
        this._alertStore.addAlert({
          message: "Error al cargar los snacks",
          type: 'error'
        });
      }
    });
  }

  loadCinemaInfo() {
    this._cinemaService.getCinemaById(this.cinemaId).subscribe({
      next: (cinema) => {
        this.cinemaName = cinema.name;
      },
      error: (error) => {
        console.error('Error al cargar información del cine:', error);
        this._alertStore.addAlert({
          message: "No se ha podido cargar la información del cine",
          type: 'error'
        });
      }
    });
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  applyFilters() {
    const searchLower = this.searchText.toLowerCase().trim();
    
    if (searchLower === '') {
      this.filteredSnacks = [...this.snacks];
    } else {
      this.filteredSnacks = this.snacks.filter(snack =>
        snack.name.toLowerCase().includes(searchLower) ||
        snack.description.toLowerCase().includes(searchLower)
      );
    }
  }

  clearFilters() {
    this.searchText = '';
    this.filteredSnacks = [...this.snacks];
  }

  hasActiveFilters(): boolean {
    return this.searchText.trim() !== '';
  }

  addToCart(snack: Snack) {
    const existingItem = this.cart.find(item => item.id === snack.id);
    
    if (existingItem) {
      existingItem.quantity++;
      existingItem.subtotal = existingItem.quantity * existingItem.price;
    } else {
      this.cart.push({
        ...snack,
        quantity: 1,
        subtotal: snack.price
      });
    }

/*     this._alertStore.addAlert({
      message: `${snack.name} agregado al carrito`,
      type: 'success'
    }); */
  }

  increaseQuantity(item: CartItem) {
    item.quantity++;
    item.subtotal = item.quantity * item.price;
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
      item.subtotal = item.quantity * item.price;
    }
  }

  removeFromCart(item: CartItem) {
    const index = this.cart.findIndex(cartItem => cartItem.id === item.id);
    if (index > -1) {
      this.cart.splice(index, 1);
      this._alertStore.addAlert({
        message: `${item.name} eliminado del carrito`,
        type: 'info'
      });
    }
  }

  clearCart() {
    this.cart = [];
    this._alertStore.addAlert({
      message: 'Carrito vaciado',
      type: 'info'
    });
  }

  getCartTotal(): number {
    return this.cart.reduce((total, item) => total + item.subtotal, 0);
  }

  getCartItemsCount(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  isInCart(snack: Snack): boolean {
    return this.cart.some(item => item.id === snack.id);
  }

  getCartItemQuantity(snack: Snack): number {
    const item = this.cart.find(cartItem => cartItem.id === snack.id);
    return item ? item.quantity : 0;
  }

  proceedToCheckout() {
    if (this.cart.length === 0) {
      this._alertStore.addAlert({
        message: 'El carrito está vacío',
        type: 'warning'
      });
      return;
    }

    console.log('Orden a procesar:', this.cart);
    
    this._alertStore.addAlert({
      message: 'Procesando orden...',
      type: 'info'
    });

    // Por ahora solo mostramos un mensaje
    // Después podrías navegar a una página de checkout o abrir un modal
  }
}