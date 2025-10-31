import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Award,
  MessageSquare
} from 'lucide-angular';

interface ReportCard {
  title: string;
  description: string;
  routerLink: string;
  icon: any;
  colorClass: string;
}

@Component({
  selector: 'app-dash-report',
  standalone: true,
  imports: [RouterModule, LucideAngularModule, CommonModule],
  templateUrl: './dash-report.component.html',
  styleUrl: './dash-report.component.css'
})
export class DashReportComponent implements OnInit {

  readonly DollarSign = DollarSign;
  readonly ShoppingCart = ShoppingCart;
  readonly TrendingUp = TrendingUp;
  readonly Award = Award;
  readonly MessageSquare = MessageSquare;


  reportes: ReportCard[] = [];

  ngOnInit(): void {
    this.reportes = [
      {
        title: 'Ganancias por Intervalo',
        description: 'Visualiza las ganancias totales generadas en un rango de fechas específico.',
        routerLink: '/admin/report1',
        icon: this.DollarSign,
        colorClass: 'bg-green-500 hover:bg-green-600',
      },
      {
        title: 'Anuncios Comprados (Intervalo)',
        description: 'Consulta la cantidad de anuncios comprados por los anunciantes en un período de tiempo.',
        routerLink: '/admin/report-ads',
        icon: this.ShoppingCart,
        colorClass: 'bg-blue-500 hover:bg-blue-600',
      },
      {
        title: 'Ganancias por Anunciante',
        description: 'Detalle de las ganancias aportadas por cada anunciante en un intervalo seleccionado.',
        routerLink: '/admin/report3',
        icon: this.TrendingUp,
        colorClass: 'bg-indigo-500 hover:bg-indigo-600',
      },
      {
        title: 'Top 5 Salas por Calificación',
        description: 'Identifica las 5 salas de cine con las mejores calificaciones promedio de los usuarios.',
        routerLink: '/admin/report4',
        icon: this.Award,
        colorClass: 'bg-yellow-500 hover:bg-yellow-600',
      },
      {
        title: 'Top 5 Salas por Comentarios',
        description: 'Reporte de las 5 salas que han generado la mayor cantidad de comentarios o reseñas.',
        routerLink: '/admin/report5',
        icon: this.MessageSquare,
        colorClass: 'bg-red-500 hover:bg-red-600',
      },
    ];
  }

}
