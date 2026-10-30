import { Component, computed, input, TemplateRef, viewChildren, ViewEncapsulation } from '@angular/core';

import { MatListModule } from '@angular/material/list';

import { F24Image } from '../image/image';
import { F24SidenavItem } from '../sidenav-item/sidenav-item';

import { F24SidenavSource, F24SidenavSourceParams } from './sidenav-source';
import { F24LogoSwap } from '../logo-swap/logo-swap';
import { NgTemplateOutlet } from '@angular/common';

/**
 * Sidenav
 */
@Component({
  selector: 'f24-sidenav',
  imports: [
    NgTemplateOutlet, MatListModule, 
    F24SidenavItem, F24Image, F24LogoSwap
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
  readonly resolvedAllowExpandedMultiple = computed(() => this.source()?.allowExpandedMultiple() ?? this.allowExpandedMultiple());
  
  readonly templateLogo = input<TemplateRef<any>>();
  /**
   * changeExpanded
   */
  changeExpanded(): void {
    if(!this.resolvedAllowExpandedMultiple()) {
      this.items().forEach(item => item.setExpanded(false));
    }
  }
}
