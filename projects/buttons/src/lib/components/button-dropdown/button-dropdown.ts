import { Component, effect, input, output, TemplateRef, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MtxPopoverModule } from '@ng-matero/extensions/popover';

import { F24Icon } from '@f24/layout';

import { createButtonDropdownSource, createButtonDropdownSourceParams, F24ButtonDropdownSourceParams } from './button-dropdown-source';

/**
 * F24ButtonDropdown
 */
@Component({
  selector: 'f24-button-dropdown',
  imports: [
    NgTemplateOutlet,
    MatButtonModule, MtxPopoverModule, 
    F24Icon
  ],
  templateUrl: './button-dropdown.html',
  styleUrl: './button-dropdown.scss',
})
export class F24ButtonDropdown {

  /**
   * source 
   */
  readonly params = input(createButtonDropdownSourceParams());
  readonly source = input(createButtonDropdownSource());
  /**
   * inputs
   */
  readonly label = input<F24ButtonDropdownSourceParams['label']>();
  readonly tooltip = input<F24ButtonDropdownSourceParams['tooltip']>();
  readonly icon = input<F24ButtonDropdownSourceParams['icon']>();
  readonly iconSize = input<F24ButtonDropdownSourceParams['iconSize']>();
  readonly dropdownPosition = input<F24ButtonDropdownSourceParams['dropdownPosition']>();
  readonly dropdownEnterDelay = input<F24ButtonDropdownSourceParams['dropdownEnterDelay']>();
  readonly dropdownLeaveDelay = input<F24ButtonDropdownSourceParams['dropdownLeaveDelay']>();
  /**
   * outputs
   */
  readonly click = output();
  /**
   * dropdownTemplate
   */
  readonly dropdownTemplate = input<TemplateRef<any>>();
  /**
   * constructor
   */
  constructor() {
    /**
     * efecto para asignar params
     */
    effect(() => {
      this.source()?.update({
        label: this.label(),
        tooltip: this.tooltip(),
        icon: this.icon(),
        iconSize: this.iconSize(),
        dropdownPosition: this.dropdownPosition(),
        dropdownEnterDelay: this.dropdownEnterDelay(),
        dropdownLeaveDelay: this.dropdownLeaveDelay()
      }, this.params());
    });
  }
}
