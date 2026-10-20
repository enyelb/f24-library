import { Component, computed, input, viewChildren, ViewEncapsulation } from '@angular/core';

import { MatListModule } from '@angular/material/list';

import { F24Image } from '../image/image';
import { F24SidenavItem } from '../sidenav-item/sidenav-item';

import { F24SidenavSource, F24SidenavSourceParams } from './sidenav-source';

/**
 * Sidenav
 */
@Component({
  selector: 'f24-sidenav',
  imports: [
    MatListModule, F24SidenavItem, F24Image
  ],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
  encapsulation: ViewEncapsulation.None,
})
export class F24Sidenav {
  /**
   * source 
   */
  readonly source = input<F24SidenavSource>();
  /**
   * inputs
   */
  readonly logo = input<F24SidenavSourceParams['logo']>();
  readonly name = input<F24SidenavSourceParams['name']>();
  readonly routes = input<F24SidenavSourceParams['routes']>();
  readonly isMobile = input<F24SidenavSourceParams['isMobile']>();
  readonly allowExpandedMultiple = input<F24SidenavSourceParams['allowExpandedMultiple']>(false);
  /**
   * items
   */
  readonly items = viewChildren(F24SidenavItem);
  /**
   * signals resolved from source or inputs
   */
  readonly resolvedLogo = computed(() => this.source()?.logo() ?? this.logo());
  readonly resolvedName = computed(() => this.source()?.name() ?? this.name());
  readonly resolvedRoutes = computed(() => this.source()?.routes() ?? this.routes() ?? []);
  readonly resolvedIsMobile = computed(() => this.source()?.isMobile() ?? this.isMobile());
  readonly resolvedAllowExpandedMultiple = computed(() => this.source()?.allowExpandedMultiple() ?? this.allowExpandedMultiple());
  /**
   * changeExpanded
   */
  changeExpanded(): void {
    if(!this.resolvedAllowExpandedMultiple()) {
      this.items().forEach(item => item.setExpanded(false));
    }
  }
}
