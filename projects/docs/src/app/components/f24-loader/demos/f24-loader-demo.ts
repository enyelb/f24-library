import { Component } from '@angular/core';
import { F24Loader } from '@f24/layout';

@Component({
  selector: 'f24-loader-demo',
  standalone: true,
  imports: [F24Loader],
  template: `
    <div style="display: flex; gap: 3rem; align-items: center; justify-content: space-around; min-height: 140px; padding: 2rem; border: 1px solid #e2e8f0; border-radius: 8px;">
      <div style="text-align: center;">
        <span style="font-size: 12px; color: gray; display: block; margin-bottom: 12px;">Loader con Icono Predeterminado:</span>
        <f24-loader [isLoading]="true" />
      </div>

      <div style="text-align: center;">
        <span style="font-size: 12px; color: gray; display: block; margin-bottom: 12px;">Loader con Icono Material Personalizado:</span>
        <f24-loader [isLoading]="true" [icon]="'sync'" />
      </div>
    </div>
  `,
})
export class F24LoaderDemo {}
