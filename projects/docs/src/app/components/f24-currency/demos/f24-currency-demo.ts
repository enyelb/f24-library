import { Component } from '@angular/core';
import { F24Currency } from '@f24/layout';

@Component({
  selector: 'f24-currency-demo',
  standalone: true,
  imports: [F24Currency],
  template: `
    <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
      <div style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px;">
        <span style="font-size: 12px; color: gray;">Estilo Estándar:</span>
        <f24-currency [label]="'Total a Pagar'" [ves]="3450.75" [usd]="75.00" />
      </div>

      <div style="--primary-color: #059669; --red-color: #dc2626; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px;">
        <span style="font-size: 12px; color: gray;">Con Variables CSS Personalizadas:</span>
        <f24-currency [label]="'Saldo Pendiente'" [ves]="1250.00" [usd]="28.50" />
      </div>
    </div>
  `,
})
export class F24CurrencyDemo {
  readonly label = 'Total a Pagar';
  readonly ves = 3450.75;
  readonly usd = 75.00;
}
