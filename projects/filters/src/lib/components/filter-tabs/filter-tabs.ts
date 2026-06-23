import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, output, ViewEncapsulation } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

import { F24TouchScrollDirective } from '@f24/core';
import { F24Icon } from '@f24/layout';

import { createFilterTabsSource, createFilterTabsSourceParams, F24FilterTabsSourceParams } from './filter-tabs-source';

/**
 * F24FilterTabsComponent
 */
@Component({
  selector: 'f24-filter-tabs',
  styleUrls: ['filter-tabs.scss'],
  templateUrl: 'filter-tabs.html',
  standalone: true,
  imports: [
    MatButtonToggleModule, MatIconModule, MatTooltipModule,
    F24Icon, F24TouchScrollDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class F24FilterTabs {
  /**
   * elementRef
   */
  protected readonly elementRef = inject(ElementRef);
  /**
   * source 
   */
  readonly params = input(createFilterTabsSourceParams());
  readonly source = input(createFilterTabsSource());
  /**
   * inputs
   */
  readonly id = input<F24FilterTabsSourceParams['id']>();
  readonly dataSource = input<F24FilterTabsSourceParams['dataSource']>();
  readonly default = input<F24FilterTabsSourceParams['default']>();
  readonly form = input<F24FilterTabsSourceParams['form']>();
  readonly change = input<F24FilterTabsSourceParams['change']>();
  readonly items = input<F24FilterTabsSourceParams['items']>();
  /**
   * outputs
   */
  readonly onColor = output<string>(); 
  /**
   * constructor
   */
  constructor() {
    /**
     * efecto para asignar params
     */
    effect(() => {
      this.source()?.update({
        id: this.id(),
        dataSource: this.dataSource(),
        default: this.default(),
        form: this.form(),
        change: this.change(),
        items: this.items(),
      }, this.params());
    });
    /**
     * 
     */
    effect(() => {
      const color = this.source().color();
      this.onColor.emit(color);
    })
  }

  /**
   * changeValue
   * @param event 
   */
  protected changeValue(event: MatButtonToggleChange) {
    const items = this.source().items();
    const value = Object.fromEntries(
      items.map(item => [item.name, event.value == item.name && !item.isDefault ? true: undefined])
    );
    this.source().form().setValue(value);
  }
}
