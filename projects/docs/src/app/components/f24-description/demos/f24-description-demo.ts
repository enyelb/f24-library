import { Component } from '@angular/core';
import { F24Description, F24ItemsOpts, F24StatusOpts } from '@f24/layout';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'f24-description-demo',
  standalone: true,
  imports: [F24Description, MatButtonModule],
  template: `
    <div style="--primary-color: #2563eb; --success: #16a34a; display: flex; flex-direction: column; gap: 1.5rem;">
      <f24-description
        [title]="'Factura #FAC-2026-0042'"
        [subtitle]="'Emitida el 05 de Septiembre, 2026'"
        [icon]="{ name: 'verified', tooltip: 'Documento Verificado' }"
        [status]="statusList"
        [items]="itemList"
      >
        <button mat-flat-button right>Descargar PDF</button>
      </f24-description>
    </div>
  `,
})
export class F24DescriptionDemo {
  readonly statusList: F24StatusOpts[] = [
    { label: 'Pagada', color: '#166534', background: '#dcfce7' },
  ];

  readonly itemList: F24ItemsOpts[] = [
    { label: 'Cliente:', text: 'Acme Corporation' },
    { icon: 'attach_money', label: 'Total:', text: '1,450.00 USD', color: 'primary' },
    { label: 'Vendedor:', text: 'Juan Pérez' },
  ];
}
