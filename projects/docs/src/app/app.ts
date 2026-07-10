import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NgDocNavbarComponent, NgDocRootComponent, NgDocSidebarComponent, NgDocThemeToggleComponent } from '@ng-doc/app';

/**
 * App
 */
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NgDocRootComponent, NgDocNavbarComponent, NgDocSidebarComponent, NgDocThemeToggleComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('docs');
}
