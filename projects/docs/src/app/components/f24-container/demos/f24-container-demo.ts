import { Component } from '@angular/core';
import { F24Container } from '@f24/layout';

@Component({
  selector: 'f24-container-demo',
  standalone: true,
  imports: [F24Container],
  template: `
    <div style="--border-primary: #cbd5e1; --mat-sys-surface: #ffffff; padding: 1rem;">
      <f24-container>
        <div style="padding: 1.5rem;">
          <h3 style="margin-top: 0;">Contenedor Estándar</h3>
          <p>Este contenido se encuentra proyectado dentro de <code>f24-container</code> con bordes y fondo redondeado.</p>
        </div>
      </f24-container>
    </div>
  `,
})
export class F24ContainerDemo {}
