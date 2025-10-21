import { Component } from '@angular/core';
import {
  Popcorn,
  Plus,
  Filter,
  RotateCcw,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Eye,
  Edit,
  Ban,
  Coffee,
  Package,
  Sandwich,
  LucideAngularModule,
} from 'lucide-angular';

@Component({
  selector: 'app-snacks-page',
  imports: [LucideAngularModule],
  templateUrl: './snacks-page.component.html',
})
export class SnacksPageComponent {
  // Iconos de lucide-angular
  readonly Popcorn = Popcorn;
  readonly Plus = Plus;
  readonly Filter = Filter;
  readonly RotateCcw = RotateCcw;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;
  readonly DollarSign = DollarSign;
  readonly TrendingDown = TrendingDown;
  readonly TrendingUp = TrendingUp;
  readonly Eye = Eye;
  readonly Edit = Edit;
  readonly Ban = Ban;
  readonly Coffee = Coffee;
  readonly Package = Package;
  readonly Sandwich = Sandwich;
}
