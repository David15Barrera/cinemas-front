import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertsComponent } from '@shared/components/alerts/alerts.component';
import { ModalComponent } from "./shared/components/modal/modal.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertsComponent, ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Comer & Dormir';
}
