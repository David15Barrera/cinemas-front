import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthStore } from 'app/store/auth.store';

@Component({
  selector: 'app-layout-customer',
  imports: [RouterModule, RouterLink],
  templateUrl: './layout-customer.component.html',
})
export class LayoutCustomerComponent { 

  public readonly store = inject(AuthStore);

}
