import { ChangeDetectionStrategy, Component, computed, input, signal, viewChild } from '@angular/core';

import { MatSortModule } from '@angular/material/sort';
import { MatColumnDef, MatHeaderRowDef, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

import { F24DataSource } from '@f24/data';

/**
 * F24ColumnSelect
 */
@Component({
  selector: 'f24-column-select',
  imports: [MatTableModule, MatSortModule, MatTooltipModule, MatCheckboxModule],
  templateUrl: './column-select.html',
  styleUrl: './column-select.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24ColumnSelect<T> {
  /**
   * column esta es la columna que usa el matColumnDef 
   */
  readonly column = input('select');
  /**
   * cell este valor se usa para obtener el id de los seleccionados
   */
  readonly cell = input<keyof T | ((item: T) => any)>();
  /**
   * matColumnDef este variable es para pasarla al matTable
   */
  readonly matColumnDef = viewChild(MatColumnDef);
  /**
   * matHeaderRowDef este variable es para pasarla al matTable
   **/
  readonly matHeaderRowDef = viewChild(MatHeaderRowDef);
  /**
   * dataSource
   */
  protected readonly dataSource = signal<F24DataSource<T> | null>(null);
  /**
   * allSelectedByValues
   */
  protected readonly allSelectedByValues = computed(() => {
    const cell = this.cell();
    return this.dataSource()?.allSelected().map(item => this.fnSelectedById(item, cell)) ?? [];
  });
  /**
   * dataByValues
   */
  protected readonly dataByValues = computed(() => {
    const cell = this.cell();
    return this.dataSource()?.data().map(item => this.fnSelectedById(item, cell)) ?? [];
  })
  /**
   * isAllSelected esta variable marca el checkbox de seleccionar todos 
   */
  protected readonly isAllSelected = computed(() => {
    return this.dataByValues().every(id => this.allSelectedByValues().includes(id));;
  });
  /**
   * isIndeterminate esta variable marca el checkbox de seleccionar todos como indeterminado
   */
  protected readonly isIndeterminate = computed(() => {
    return !this.dataByValues().every(id => this.allSelectedByValues().includes(id)) && this.allSelectedByValues().length > 0;
  });
  /**
   * fnSelectedById
   */
  protected readonly fnSelectedById = (item: T, cell?: keyof T | ((item: T) => any)) => {
    if (typeof cell === 'function') {
      return cell(item);
    }
    return cell ? item[cell] : item;
  }
  /**
   * dataSource
   */
  set setDataSource(dataSource: F24DataSource<T>) {
    this.dataSource.set(dataSource);
  }
  /**
   * select
   * @param item
   * @param index
   * @param select
   */
  protected select(item: T, select: boolean = true): void {
    /**
     * agregar o quitar de la lista de seleccionados el item
     */
    this.dataSource()?.select(item, select);
  }
  /**
   * selectAll
   * @param select
   */
  protected selectAll(select: boolean = true): void {
    /**
     * agregar o quitar de la lista de seleccionados todos los items
     */
    this.dataSource()?.selectAll(select);
  }
  /**
   * isSelected
   * @param row
   */
  protected isSelected(row: T) {
    const dataSource = this.dataSource();
    if (!dataSource) {
      return;
    }
    const allSelected = dataSource.allSelected();
    const cell = this.cell();
    return allSelected.some(item => this.fnSelectedById(item, cell) === this.fnSelectedById(row, cell));
  }
}
