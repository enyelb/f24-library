import { Component } from '@angular/core';
import { F24Navbar } from '@f24/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'f24-navbar-demo',
  standalone: true,
  imports: [F24Navbar, MatButtonModule, MatIconModule],
  template: `
    <div style="--f24-navbar-background: #1e293b; --f24-navbar-color: #f8fafc; border-radius: 8px; overflow: hidden;">
      <f24-navbar 
        [name]="'Portal Corporativo'" 
        [icon]="'menu'" 
        (toggleNavbar)="handleToggle()"
      >
        <div options style="display: flex; gap: 8px; align-items: center;">
          <button mat-icon-button aria-label="Notificaciones">
            <mat-icon>notifications</mat-icon>
          </button>
          <button mat-icon-button aria-label="Perfil">
            <mat-icon>account_circle</mat-icon>
          </button>
        </div>
      </f24-navbar>
    </div>
  `,
})
export class F24NavbarDemo {
  handleToggle(): void {
    console.log('Navbar toggled');
  }
}
