import { Component } from '@angular/core';
import { F24Icon } from '@f24/layout';

@Component({
  selector: 'f24-icon-demo',
  standalone: true,
  imports: [F24Icon],
  template: `
    <div style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <f24-icon [icon]="'home'" [size]="20" />
        <span style="font-size: 13px;">20px</span>
      </div>

      <div style="display: flex; align-items: center; gap: 8px;">
        <f24-icon [icon]="'settings'" [size]="28" />
        <span style="font-size: 13px;">28px</span>
      </div>

      <div style="display: flex; align-items: center; gap: 8px; color: #2563eb;">
        <f24-icon [icon]="'verified_user'" [size]="36" />
        <span style="font-size: 13px;">36px con color</span>
      </div>
    </div>
  `,
})
export class F24IconDemo {}
