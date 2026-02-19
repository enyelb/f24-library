import { ChangeDetectionStrategy, Component, effect, input, signal, untracked, viewChild, WritableSignal } from '@angular/core';

import { MatSortModule } from '@angular/material/sort';
import { MatColumnDef, MatHeaderRowDef, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

import { F24DataSource } from '../../source/data-source';

import { F24_COLUMN_DEF_TOKEN } from '../../column-token';

/**
 * F24ColumnSelect
 */
@Component({
  selector: 'f24-column-select',
  imports: [MatTableModule, MatSortModule, MatTooltipModule, MatCheckboxModule],
  templateUrl: './column-select.html',
  styleUrl: './column-select.scss',
  standalone: true,
  providers: [
    {
      provide: F24_COLUMN_DEF_TOKEN,
      useFactory: (component: F24ColumnSelect<any>) => component,
      deps: [F24ColumnSelect]
    },
  ],
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
   * isAllSelected esta variable marca el checkbox de seleccionar todos 
   */
  protected readonly isAllSelected = signal(false);
  /**
   * isIndeterminate esta variable marca el checkbox de seleccionar todos como indeterminado
   */
  protected readonly isIndeterminate = signal(false);
  /**
   * selectedList este es el array de los checkbox visibles en la tabla
   */
  protected readonly selectedList: WritableSignal<boolean>[] = [];
  /**
   * constructor
   */
  constructor() {
    /**
     * fnSelectedById
     */
    const fnSelectedById = (item: T, cell?: keyof T | ((item: T) => any)) => {
      if (typeof cell === 'function') {
        return cell(item);
      }
      
      return cell ? item[cell] : item;
    }
    /**
     * efecto para crear o modificar los checkbox de seleccion
     */
    effect(() => {
      /**
       * validar si existe el data source
       */
      const dataSource = this.dataSource();
      if (!dataSource) {
        return;
      }
      /**
       * signals que activan este efecto
       */
      const data = dataSource.data(); 
      const page = dataSource.page();
      
      untracked(() => { 
        /**
         * obtener todos los items seleccionados del datasource
         */
        const allSelected = dataSource.allSelected();
        /**
         * obtener id para identificar los items
         */
        const cell = this.cell();

        /**
         * transformar los valores seleccionados y los visibles en la tabla
         * por el id que identifica a cada item  
         */
        const allSelectedByValues = allSelected.map(item => fnSelectedById(item, cell));
        const dataByValues = data.map(item => fnSelectedById(item, cell));
        /**
         * recorrer toda la data visible en el datasource
         */
        dataByValues.forEach((value: any, index: number) => {
          /**
           * verificar si el item esta selecionado o no
           */
          const isSelected = allSelectedByValues.some((selected) => selected === value);
          /**
           * asignar el valor del item, crear un signal o modificar sengun seal el caso
           * se usa el index para identificar estos signals en el html
           */
          this.selectList(index, isSelected);
        });
      });
    }, { debugName: 'F24ColumnSelect' })
    /**
     * efecto para actualizar isAllSelected y isIndeterminate
     */
    effect(() => {
      /**
       * validar si existe el data source
       */
      const dataSource = this.dataSource();
      if (!dataSource) {
        return;
      }
      /**
       * signals que activan este efecto
       */
      const data = dataSource.data();
      const allSelected = dataSource.allSelected();
      const cell = this.cell();
      const page = dataSource.page();
      /**
       * si no hay nada que seleccionar marcar isAllSelected y isIndeterminate como false
       */
      if (!data || data.length === 0) {
        this.isAllSelected.set(false);
        this.isIndeterminate.set(false);
        return;
      }
      /**
       * transformar los valores seleccionados y los visibles en la tabla
       * por el id que identifica a cada item  
       */
      const allSelectedByValues = allSelected.map(item => fnSelectedById(item, cell));
      const dataByValues = data.map(item => fnSelectedById(item, cell));

      // Check how many items visible on the current page are selected
      // Note: This relies on object reference equality, which reconciliation ensures
      const selectedCountOnPage = dataByValues.filter(item => allSelectedByValues.includes(item)).length;

      this.isAllSelected.set(selectedCountOnPage === data.length);
      this.isIndeterminate.set(selectedCountOnPage > 0 && selectedCountOnPage < data.length);
    }, { debugName: 'F24ColumnSelect' });
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
  protected select(item: T, index: number, select: boolean = true): void {
    /**
     * agregar o quitar marca en el checkbox[index]
     */
    this.selectList(index, select);
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
     * agregar o quitar marca en todos los checkboxs
     */
    this.selectedList.forEach(item => item.set(select));
    /**
     * agregar o quitar de la lista de seleccionados todos los items
     */
    this.dataSource()?.selectAll(select);
  }
  /**
   * selectList
   * @param index
   * @param select
   */
  protected selectList(index: number, select: boolean = true): void {
    /**
     * asignar el valor del item, crear un signal o modificar sengun seal el caso
     * se usa el index para identificar estos signals en el html
     */
    if (this.selectedList[index] == undefined) {
      this.selectedList[index] = signal(false);
    } else {
      this.selectedList[index].set(select);
    }
  }
}
