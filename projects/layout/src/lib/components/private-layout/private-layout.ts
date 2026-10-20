import { Component, signal, inject, computed, input, effect, untracked } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatSidenavModule } from '@angular/material/sidenav';

import { filter, map } from 'rxjs';

import { F24LayoutService } from '../../services/layout-service';

import { F24ResponsiveClassDirective } from '../../directives/responsive-class-directive';

import { F24Navbar } from '../navbar/navbar';
import { F24Sidenav } from '../sidenav/sidenav';
import { F24SidenavRouteSourceParams } from '../sidenav/sidenav-source';
import { F24PrivateLayoutSource, F24PrivateLayoutSourceParams } from './private-layout-source';



/**
 * F24PrivateLayout
 */
@Component({
  selector: 'f24-private-layout',
  imports: [
    RouterOutlet, 
    MatSidenavModule, 
    F24Navbar, F24Sidenav, F24ResponsiveClassDirective
  ],
  templateUrl: './private-layout.html',
  styleUrl: './private-layout.scss',
  //encapsulation: ViewEncapsulation.None,
})
export class F24PrivateLayout {
  /**
   * services
   */
  protected readonly layout = inject(F24LayoutService);
  protected readonly router = inject(Router); 
  /**
   * inputs
   */
  readonly source = input<F24PrivateLayoutSource>();
  readonly name = input<F24PrivateLayoutSourceParams['name']>();
  readonly compactName = input<F24PrivateLayoutSourceParams['compactName']>();
  readonly logo = input<F24PrivateLayoutSourceParams['logo']>();
  readonly routes = input<F24PrivateLayoutSourceParams['routes']>();
  readonly icon = input<F24PrivateLayoutSourceParams['icon']>();
  readonly compact = input<F24PrivateLayoutSourceParams['compact']>();
  readonly top = input<F24PrivateLayoutSourceParams['top']>();
  readonly position = input<F24PrivateLayoutSourceParams['position']>();
  readonly title = input<F24PrivateLayoutSourceParams['title']>();
  /**
   * signals resolved
   */
  readonly resolvedName = computed(() => this.source()?.name() ?? this.name() ?? '');
  readonly resolvedCompactName = computed(() => this.source()?.compactName() ?? this.compactName() ?? '');
  readonly resolvedLogo = computed(() => this.source()?.logo() ?? this.logo() ?? '');
  readonly resolvedRoutes = computed(() => this.source()?.routes() ?? this.routes() ?? []);
  readonly resolvedIcon = computed(() => this.source()?.icon() ?? this.icon() ?? 'menu');
  readonly resolvedCompact = computed(() => this.source()?.compact() ?? this.compact() ?? false);
  readonly resolvedTop = computed(() => this.source()?.top() ?? this.top() ?? false);
  readonly resolvedPosition = computed(() => this.source()?.position() ?? this.position() ?? 'start');
  readonly resolvedTitle= computed(() => this.source()?.title() ?? this.title() ?? '');

  /**
   * signals de estado del sidenav y del layout
   */
  protected readonly isSidenavOpen = signal(true);
  protected readonly oldIsSidenavOpen = signal(true);
  
  protected readonly isMobile = computed(() => this.layout.is(['xs', 's']));
  protected readonly mode = computed(() => this.isMobile() ? 'over' : 'side');
  protected readonly routeCurrent = toSignal(this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map(event => event.urlAfterRedirects)
  ), { initialValue: '/' });

  /**
   * constructor
   */
  constructor () {
    /**
     * efecto para almacenar el estado del sidenav cuando cambia a side
     * y cuando vuelve a over ponerle su estado anterior
     */
    effect(() => {
      const mode = this.mode();

      untracked(() => {
        if (mode == 'over') {
          this.oldIsSidenavOpen.set(this.isSidenavOpen());
          this.isSidenavOpen.set(false);
        } else {
          this.isSidenavOpen.set(this.oldIsSidenavOpen());
        }
      })
    });
    /**
     * para ocultar automaticamente el sidenav si el modo es over y 
     * cambia la ruta
     */
    effect(() => {
      const route = this.routeCurrent();
      untracked(() => {
        const mode = this.mode();
        if (mode === 'over') {
          this.isSidenavOpen.set(false);
        }
      })
    })
  }
  
  /**
   * toggle the sidenav open state
   */
  protected onToggleSidenav(): void {
    this.isSidenavOpen.set(!this.isSidenavOpen());
  }
  /**
   * find the active route from a list of routes
   */
  protected findRouteActive = (routes: F24SidenavRouteSourceParams[]): F24SidenavRouteSourceParams | undefined => {
    for (const route of routes) {
      if (route.url === this.routeCurrent()) {
        return route;
      }

      if (route.children) {
        const found = this.findRouteActive(route.children);
        if (found) {
          return found;
        }
      }
    }
    return;
  }
}