import { Component, input, effect, untracked, contentChildren, afterNextRender, ChangeDetectionStrategy, signal, viewChild, ViewEncapsulation, viewChildren, afterRenderEffect, computed } from '@angular/core';

import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { distinctUntilChanged, of, switchMap } from 'rxjs';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';

import { createDataSource, createDataSourceParams } from '@f24/data';

import { F24Column } from '../column/column';
import { F24ColumnSelect } from '../column-select/column-select';
import { F24TableStandard } from '../table-standard/table-standard';
import { F24TableStandardMaterial } from "../table-standard-material/table-standard-material";


/**
 * F24Table
 */
@Component({
  selector: 'f24-table',
  styleUrls: ['table.scss'],
  templateUrl: 'table.html',
  standalone: true,
  imports: [
    ScrollingModule, 
    MatProgressBarModule, MatPaginatorModule, 
    F24TableStandard, F24TableStandardMaterial
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24Table<T> {
  /**
   * params
   */
  readonly params = input(createDataSourceParams<T>());
  readonly source = input(createDataSource(this.params()));
  readonly color = input('primary');
  readonly rowClass = input<(row: T) => string | string[] | { [key:string]: boolean }>();
  protected _rowClass = computed(() => {
    const rowClass = this.rowClass();
    return (row: T) => {
      if (!rowClass) {
        return {};
      }
      const rowClassFormat = rowClass(row);
      if (typeof rowClassFormat === 'object' && !(rowClassFormat instanceof Array)) {
        return rowClassFormat;
      }
      const newRowClass: { [key:string]: boolean } = {};
      if (rowClassFormat instanceof Array) {
        rowClassFormat.forEach(r => newRowClass[r] = true);
      } else if (typeof rowClassFormat === 'string') {
        newRowClass[rowClassFormat] = true;
      }
      return newRowClass;
    }
  })
  /**
   * view childs
   */
  protected readonly paginator = viewChild(MatPaginator);
  protected readonly scroll = viewChild(CdkVirtualScrollViewport);
  protected readonly tables = viewChildren(F24TableStandard);
  protected readonly itemSize = signal(52);
  /**
   * content childrens
   */
  protected readonly columnSelects = contentChildren(F24ColumnSelect<T>);
  protected readonly columns = contentChildren(F24Column);
  /**
   * page
   */
  protected readonly page = toSignal(
    toObservable(this.paginator).pipe(
      distinctUntilChanged(),
      switchMap(p => p?.page ?? of(null)),
      takeUntilDestroyed()
    ),
    { initialValue: null }
  );
  /**
   * scrollOffset
   */
  protected readonly scrollOffset = toSignal(
    toObservable(this.scroll).pipe(
      distinctUntilChanged(),
      switchMap(s => s?.renderedContentOffset ?? of(0)),
      takeUntilDestroyed()
    ),
    { initialValue: 0 }
  );
  /**
   * isVirtualScroll
   */
  protected isVirtualScroll = signal(false);
  /**
   * constructor
   */
  constructor() {
    /**
     * conectar el data source despues de iniciar las vista
     */
    afterNextRender(() => {
      this.source().connect();
    });
    /**
     * controlar la velocidad del scroll esto es para solventar el error del vitual scroll en la version 21.1.x
     */
    effect(() => {
      const offset = this.scrollOffset();
      const heads = this.tables().map(table => table.headElement().nativeElement);

      if (!offset || heads.length == 0) {
        return;
      }

      heads.forEach(head => {
        head.style.top = `${offset * -1}px`;
      });
    })
    /**
     * efecto para asignar los parametros al source
     */
    effect(() => {
      const params = this.params();
      
      untracked(() => {
        this.source().update(params);
      });
    });
    /**
     * efecto para sincronizar page con el data source
     */
    effect(() => {
      const dataSource = this.source();
      const page = this.page();
      const sort = this.tables().map(table => table.sort()).find(sort => sort != null);
      
      untracked(() => {
        dataSource.update({
          page: page ? { index: page.pageIndex, size: page.pageSize } : undefined,
          sorts: sort ? { [sort.active]: sort.direction } : undefined
        });
      });
    });

    effect(() => {
      const dataSource = this.source();
      untracked(() => {
        this.isVirtualScroll.set(dataSource.pageSize() > 100);
        this.columnSelects().forEach(columnSelect => {
          columnSelect.setDataSource = dataSource;
        });
      });
    });
  }
  /**
   * updatePageSize
   */
  updatePageSize(size: number): void {
    const paginator = this.paginator();
    if (!paginator) {
      return;
    }
    if (this.source().total() > this.source().data().length && this.source().pageOptions().includes(size)) {
      paginator.pageSize = size;
      paginator.page.emit();
    }
  }
}
