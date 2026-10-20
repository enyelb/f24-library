import { Component } from '@angular/core';
import { F24ResponsiveView, F24ResponsiveViewComponent } from '@f24/layout';

@Component({
  selector: 'f24-sample-desktop-view',
  standalone: true,
  template: `
    <div style="padding: 1.5rem; background: #eff6ff; border-radius: 8px;">
      <h3 style="margin: 0 0 0.5rem 0; color: #1d4ed8;">🖥️ Vista de Escritorio (Desktop)</h3>
      <p style="margin: 0;">Mostrando tabla completa con columnas extendidas para pantallas medianas y grandes.</p>
    </div>
  `,
})
export class F24SampleDesktopView {}

@Component({
  selector: 'f24-sample-mobile-view',
  standalone: true,
  template: `
    <div style="padding: 1.5rem; background: #fefce8; border-radius: 8px;">
      <h3 style="margin: 0 0 0.5rem 0; color: #a16207;">📱 Vista Móvil (Mobile Cards)</h3>
      <p style="margin: 0;">Mostrando tarjetas apiladas optimizadas para pantallas compactas y táctiles.</p>
    </div>
  `,
})
export class F24SampleMobileView {}

@Component({
  selector: 'f24-responsive-view-demo',
  standalone: true,
  imports: [F24ResponsiveView],
  template: `
    <div style="height: 220px; border: 1px solid #cbd5e1; border-radius: 8px; position: relative; overflow: hidden;">
      <f24-responsive-view [components]="viewsConfig" />
    </div>
  `,
})
export class F24ResponsiveViewDemo {
  readonly viewsConfig: F24ResponsiveViewComponent<any>[] = [
    {
      id: 'DesktopView',
      sizes: ['m', 'l', 'xl', 'xxl'],
      module: async () => F24SampleDesktopView,
      icon: 'desktop_windows',
      label: 'Escritorio',
    },
    {
      id: 'MobileView',
      sizes: ['xs', 's'],
      module: async () => F24SampleMobileView,
      icon: 'smartphone',
      label: 'Móvil',
    },
  ];
}
