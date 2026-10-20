import { Component } from '@angular/core';
import { F24Divider } from '@f24/layout';

@Component({
  selector: 'f24-divider-demo',
  standalone: true,
  imports: [F24Divider],
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem; width: 100%;">
      <f24-divider [title]="'O continúa con'" />
      <f24-divider [icon]="'lock'" [title]="'Zona Segura'" />
    </div>
  `,
})
export class F24DividerDemo {}
