import { Component, input, output, ViewEncapsulation, computed } from '@angular/core';
import { UpperCasePipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

import { F24FunctionsModule } from '@f24/functions';
import { F24Icon } from '../icon/icon';

import { F24NavbarSource, F24NavbarSourceParams } from './navbar-source';
import { F24Image } from '../image/image';

/**
 * F24Navbar
 */
@Component({
  selector: 'f24-navbar',
  imports: [
    MatToolbarModule, MatButtonModule, UpperCasePipe,
    F24FunctionsModule, F24Icon, F24Image,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  encapsulation: ViewEncapsulation.None,
})

export class F24Navbar {
  /**
   * source 
   */
  readonly source = input<F24NavbarSource>();
  /**
   * inputs
   */
  readonly title = input<F24NavbarSourceParams['title']>();
  readonly icon = input<F24NavbarSourceParams['icon']>();
  readonly logo = input<F24NavbarSourceParams['logo']>();
  /**
   * resolved logo
   */
  readonly resolvedLogo = computed(() => this.source()?.logo() ?? this.logo());
  readonly resolvedIcon = computed(() => this.source()?.icon() ?? this.icon() ?? 'menu');
  readonly resolvedTitle = computed(() => this.source()?.title() ?? this.title() ?? '');
  /**
   * outputs
   */
  readonly toggleNavbar = output<void>();
  /**
   * Toggle the navbar visibility
   */
  onToggleNavbar(): void {
    this.toggleNavbar.emit();
  }

}
