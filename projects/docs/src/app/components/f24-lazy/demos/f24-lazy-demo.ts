import { Component, viewChild, AfterViewInit } from '@angular/core';
import { F24Lazy } from '@f24/layout';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'f24-lazy-child-sample',
  standalone: true,
  template: `
    <div style="padding: 1rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
      <h4 style="margin: 0 0 0.5rem 0; color: #166534;">✓ Componente cargado dinámicamente</h4>
      <p style="margin: 0; font-size: 14px;">Este bloque fue instanciado perezosamente mediante <code>F24Lazy</code>.</p>
    </div>
  `,
})
export class F24LazyChildSample {}

@Component({
  selector: 'f24-lazy-demo',
  standalone: true,
  imports: [F24Lazy, MatButtonModule],
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="display: flex; gap: 1rem;">
        <button mat-flat-button (click)="loadDynamicComponent()">Cargar Componente</button>
      </div>
      <div style="min-height: 120px; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 1rem;">
        <f24-lazy #lazyHost />
      </div>
    </div>
  `,
})
export class F24LazyDemo implements AfterViewInit {
  readonly lazyHost = viewChild<F24Lazy<F24LazyChildSample>>('lazyHost');

  ngAfterViewInit(): void {
    this.loadDynamicComponent();
  }

  loadDynamicComponent(): void {
    const host = this.lazyHost();
    if (host) {
      host
        .loadId('F24LazyChildSample')
        .load(async () => F24LazyChildSample);
    }
  }
}
