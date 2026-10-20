import { Component } from '@angular/core';
import { F24Quantity } from '@f24/layout';

@Component({
  selector: 'f24-quantity-demo',
  standalone: true,
  imports: [F24Quantity],
  template: `
    <div style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap;">
      <div style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px;">
        <f24-quantity 
          [label]="'Stock Disponible:'" 
          [quantity]="1420" 
          [icon]="'inventory_2'" 
          [tooltip]="'Unidades en almacén central'"
        />
      </div>

      <div style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px;">
        <f24-quantity 
          [label]="'Pedidos Procesados:'" 
          [quantity]="85" 
          [icon]="'local_shipping'" 
          [tooltip]="'Órdenes en ruta'"
        />
      </div>
    </div>
  `,
})
export class F24QuantityDemo {}
