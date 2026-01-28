import { booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChild, effect, input, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { MatSortHeader, MatSortModule } from '@angular/material/sort';
import { MatColumnDef, MatFooterRowDef, MatHeaderRowDef, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { date, toNumber, currency, round } from '@f24/functions';

import { F24_COLUMN_DEF_TOKEN, F24_FOOTER_ROW_DEF_TOKEN, F24_HEADER_ROW_DEF_TOKEN } from '../../column-token';
import { F24CellDirective } from '../../directives/cell';
import { F24FooterDirective } from '../../directives/footer';
import { F24HeaderDirective } from '../../directives/header';


/**
 * F24Column
 */
@Component({
  selector: 'f24-column',
  imports: [MatTableModule, MatSortModule, MatTooltipModule, NgTemplateOutlet],
  templateUrl: './column.html',
  styleUrl: './column.scss',
  standalone: true,
  providers: [
    {
      provide: F24_COLUMN_DEF_TOKEN,
      useFactory: (component: F24Column) => component,
      deps: [F24Column]
    },
    {
      provide: F24_HEADER_ROW_DEF_TOKEN,
      useFactory: (component: F24Column) => component,
      deps: [F24Column]
    },
    {
      provide: F24_FOOTER_ROW_DEF_TOKEN,
      useFactory: (component: F24Column) => component,
      deps: [F24Column]
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24Column {
  /**
   * inputs
   */
  readonly column = input.required<string>();
  readonly header = input<any>();
  readonly footer = input<any>();
  readonly cell = input<string>();
  readonly sort = input<string>();
  readonly tooltip = input<string>();
  readonly colspan = input<number>();
  readonly class = input<string>();
  //pipes
  readonly date = input<string>();
  readonly number = input(false, { transform: (value: string | boolean) => {
    if (value === '%') {
      return value;
    }
    return booleanAttribute(value);
  }});
  readonly currency = input(false, { transform: booleanAttribute });
  readonly round = input(null, { transform: (value: string | number) => {
    if (typeof value === 'string') {
      return Number(value);
    }
    return value;
  }});
  /**
   * content childs
   */
  protected readonly cellTemplate = contentChild(F24CellDirective);
  protected readonly headerTemplate = contentChild(F24HeaderDirective);
  protected readonly footerTemplate = contentChild(F24FooterDirective);
  /**
   * view childs
   */
  readonly matColumnDef = viewChild(MatColumnDef);
  readonly matHeaderRowDef = viewChild(MatHeaderRowDef);
  readonly matFooterRowDef = viewChild(MatFooterRowDef);
  readonly matSortHeader = viewChild(MatSortHeader);
  /**
   * computed
   */
  readonly isCell = computed(() => this.cell() !== undefined || this.cellTemplate() !== undefined);
  readonly isHeader = computed(() => this.header() !== undefined || this.headerTemplate() !== undefined || this.isCell() || (!this.isCell() && !this.isFooter()));
  readonly isFooter = computed(() => this.footer() !== undefined || this.footerTemplate() !== undefined);

  /**
   * value
   */
  protected value(data: any, property: string): any {
    let current = data;
    const names = property.split('.');
    while (names.length > 0) {
      const name = names.shift();
      if (name && name in current) {
        current = current[name];
      } else {
        return null;
      }
    }
    return current;
  }
  /**
   * transform
   */
  protected transform(value: any): any {
    let current = value;
    if (this.date() && (value instanceof Date || typeof value === 'string')) {
      current = date(current, this.date());
    }
    if (this.currency()) {
      current = currency(current);
    }
    if (this.round()) {
      current = round(current, this.round() as number);
    }
    if (this.number()) {
      current = `${toNumber(current)}${this.number() === '%' ? '%' : ''}`;
    }
    return current;
  }

  constructor() {
    effect(() => {
      const e = this.matFooterRowDef();
      if(e) {
        console.log('e', e);
        console.log(this.footerTemplate());
        console.log(this.footer());
        console.log(this.isFooter());

      }
    })
  }
}
