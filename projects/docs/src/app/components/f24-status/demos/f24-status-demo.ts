import { Component } from '@angular/core';
import { F24Status } from '@f24/layout';

@Component({
  selector: 'f24-status-demo',
  standalone: true,
  imports: [F24Status],
  template: `
    <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
      <f24-status 
        [status]="'Activo'" 
        [color]="'#15803d'" 
        [background]="'#dcfce7'" 
        [tooltip]="'La cuenta se encuentra operativa'"
      />

      <f24-status 
        [status]="'Pendiente'" 
        [color]="'#b45309'" 
        [background]="'#fef3c7'" 
        [tooltip]="'Esperando confirmación de pago'"
      />

      <f24-status 
        [status]="'Cancelado'" 
        [color]="'#b91c1c'" 
        [background]="'#fee2e2'" 
        [tooltip]="'Transacción anulada'"
      />

      <f24-status 
        [status]="'Con Detalle'" 
        [color]="'#4338ca'" 
        [background]="'#e0e7ff'" 
        [template]="customPopover"
      />

      <ng-template #customPopover>
        <div style="padding: 10px; font-size: 12px; max-width: 180px;">
          <strong>Detalle extendido:</strong>
          <p style="margin: 4px 0 0;">Información adicional mostrada mediante popover en hover.</p>
        </div>
      </ng-template>
    </div>
  `,
})
export class F24StatusDemo {}
