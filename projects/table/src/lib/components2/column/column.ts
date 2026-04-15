import { booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChild, input, TemplateRef, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { MatSortHeader, MatSortModule } from '@angular/material/sort';
import { MatColumnDef, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { date, toNumber, currency, round } from '@f24/functions';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24Column {
  /**
   * column esta es la columna que usa el matColumnDef 
   */
  readonly column = input.required<string>();
  /**
   * header esta es el header que usa el matHeaderRowDef 
   */
  readonly header = input<any>();
  /**
   * footer esta es el footer que usa el matFooterRowDef 
   */
  readonly footer = input<any>();
  /**
   * cell este es la propiedad que se usara para mostrar en la celda 
   * Nota si no exite dentro del item quedara en blanco
   */
  readonly cell = input<string>();
  /**
   * sort este es el nombre que tendra el matSortHeader
   */
  readonly sort = input<string>();
  /**
   * tooltip este el valor que tendra matTooltip en el header
   */
  readonly tooltip = input<string>();
  /**
   * colspan el espacio de las celdas esto solo se aplica al header y al footer
   */
  readonly colspan = input<number>();
  /**
   * class se le pasa al html del header, cell y el footer
   */
  readonly class = input<string>();
  /**
   * date recibe el formato de fecha 
   */
  readonly date = input<string>();
  /**
   * number recibe un boolean o %
   * Nota si recibe % lo pega al final del numero
   */
  readonly number = input(false, { transform: (value: string | boolean) => {
    if (value === '%') {
      return value;
    }
    return booleanAttribute(value);
  }});
  /**
   * currency recibe un boolean y formatea el nuemro a moneda
   */
  readonly currency = input(false, { transform: booleanAttribute });
  /**
   * round para redondear el numero recibe la cantidad de decimales
   */
  readonly round = input(null, { transform: (value: string | number) => {
    if (typeof value === 'string') {
      return Number(value);
    }
    return value;
  }});
  /**
   * cellTemplate este template *f24-cell="let row"
   */
  readonly cellTemplate = contentChild(F24CellDirective);
  /**
   * headerTemplate este template *f24-header
   */
  readonly headerTemplate = contentChild(F24HeaderDirective);
  /**
   * footerTemplate este template *f24-footer
   */
  readonly footerTemplate = contentChild(F24FooterDirective);

  /**
   * templateColumn para proyectar el contenido en la tabla
   */
  readonly templateColumn = viewChild.required('templateColumn', { read: TemplateRef });
  /**
   * matColumnDef esta columna se usa para pasarla al matTable
   */
  readonly matColumnDef = viewChild(MatColumnDef);
  /**
   * matSortHeader esta columna se usa para pasarla al matTable
   */
  readonly matSortHeader = viewChild(MatSortHeader);
  /**
   * isCell esta varaible es para saber si se mostrara la celda 
   */
  readonly isCell = computed(() => this.cell() !== undefined || this.cellTemplate() !== undefined);
  /**
   * isHeader esta varaible es para saber si se mostrara el header
   */
  readonly isHeader = computed(() => this.header() !== undefined || this.headerTemplate() !== undefined || this.isCell() || (!this.isCell() && !this.isFooter()));
  /**
   * isFooter esta varaible es para saber si se mostrara la footer
   */
  readonly isFooter = computed(() => this.footer() !== undefined || this.footerTemplate() !== undefined);
  /**
   * value este metodo procesa la propiedad del objeto 
   */
  value(data: any, property: string): any {
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
   * transform este metodo procesa los pipes
   */
  transform(value: any): any {
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
}
