import { Component } from '@angular/core';
import { F24Copy } from '@f24/layout';

@Component({
  selector: 'f24-copy-demo',
  standalone: true,
  imports: [F24Copy],
  template: `
    <div style="display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap;">
      <div>
        <span style="font-size: 13px; color: gray; display: block; margin-bottom: 4px;">Modo Icono Solo:</span>
        <f24-copy [copy]="'API_KEY_983748293482394'" />
      </div>

      <div>
        <span style="font-size: 13px; color: gray; display: block; margin-bottom: 4px;">Modo con Texto:</span>
        <f24-copy [text]="'Copiar Token'" [copy]="'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'" />
      </div>
    </div>
  `,
})
export class F24CopyDemo {
  readonly text = 'Copiar Token';
  readonly copy = 'API_KEY_983748293482394';
}
