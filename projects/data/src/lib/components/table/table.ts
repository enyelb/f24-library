import { afterNextRender, ChangeDetectionStrategy, computed, ElementRef, signal, viewChild, viewChildren, ViewEncapsulation } from '@angular/core';
import { Component, input, effect, untracked, contentChildren } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';

import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTableModule } from '@angular/cdk/table';

import { MatSort, MatSortHeader, MatSortModule } from '@angular/material/sort';
import { MatColumnDef, MatRow, MatTable, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

import { distinctUntilChanged, of, switchMap } from 'rxjs';

import { F24Loader } from '@f24/layout';

import { F24_COLUMN_DEF_TOKEN, F24_SHORT_HEADER_TOKEN } from '../../column-token';
import { F24ColumnSelect } from '../column-select/column-select';

import { createDataSource, createDataSourceParams } from '../../source/data-source';

/**
 * Table
 */
@Component({
  selector: 'f24-table',
  styleUrls: ['table.scss'],
  templateUrl: 'table.html',
  standalone: true,
  imports: [
    ScrollingModule, CdkTableModule,
    MatSortModule, MatIconModule, MatTableModule, MatProgressBarModule, MatPaginatorModule,
    F24Loader
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

  //CONFIG
  /**
   * inputs
   */
  readonly isPagination = input(true);

  /**
   * view childs
   */
  protected readonly table = viewChild.required(MatTable);
  protected readonly sorter = viewChild.required(MatSort);
  protected readonly paginator = viewChild(MatPaginator);
  protected readonly rowElements = viewChildren(MatRow, { read: ElementRef });
  protected readonly virtualScroll = viewChild(CdkVirtualScrollViewport, { read: ElementRef });

  protected readonly itemSize = signal(52);

  /**
   * content childrens
   */
  protected readonly columnDefs = contentChildren(F24_COLUMN_DEF_TOKEN);
  protected readonly sortHeaders = contentChildren(F24_SHORT_HEADER_TOKEN);

  /**
   * displayed
   */
  protected readonly displayed = computed(() => {
    const defs = this.columnDefs()
      .map(column => column instanceof MatColumnDef ? column : column.matColumnDef())
      .filter(column => !!column);

    const columns: string[] = [], header: string[] = [], footer: string[] = [];
    
    untracked(() => {
      defs.forEach(columnDef => {
        this.table().addColumnDef(columnDef);
        if (columnDef.headerCell && !columnDef.cell) {
          header.push(columnDef.name);
        } 
        if (columnDef.footerCell) {
          footer.push(columnDef.name);
        }
        if (columnDef.cell) {
          columns.push(columnDef.name);
        }
      })
    });
    
    return { columns, header, footer }
  });
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
   * sort
   */
  protected readonly sort = toSignal(
    toObservable(this.sorter).pipe(
      distinctUntilChanged(),
      switchMap(s => s?.sortChange ?? of((null))),
      takeUntilDestroyed()
    ),
    { initialValue: null }
  );

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
    /*effect((onCleanup) => {
      const scroll = this.virtualScroll()?.nativeElement;
      if (!scroll) {
        return;
      }
      const wheelHandler = (e: WheelEvent) => {
        e.preventDefault();
        scroll.scrollTop += e.deltaY * 0.5;
      };
      const controller = new AbortController();
      scroll.addEventListener('wheel', wheelHandler, { 
        passive: false, 
        signal: controller.signal 
      });
      
      onCleanup(() => controller.abort());
    })
    /**
     * controlar la velocidad del scroll
     */
    effect(() => {
      const elements = this.rowElements().filter((elementRef, index) => index === 0).map(elementRef => elementRef.nativeElement);
      
      untracked(() => {
        const newItemSize = elements.reduce((height, elementRef) => {
          return height > elementRef.getBoundingClientRect().height ? height : elementRef.getBoundingClientRect().height;
        }, this.itemSize());
        if (this.itemSize() == newItemSize) {
          return;
        }
        this.itemSize.set(newItemSize);
      });
    });
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
     * efecto para renderizar la tabla
     */
    /*effect((onCleanup) => {
      this.source().data();
    
      // Usar requestAnimationFrame para sincronizar con el ciclo de renderizado
      const rafId = requestAnimationFrame(() => {
        untracked(() => {
          this.table().renderRows();
        });
      });
      
      onCleanup(() => cancelAnimationFrame(rafId));
    });*/
    /**
     * efecto para registrar sorts
     */
    effect(() => {
      const defs = this.sortHeaders()
        .map(column => column instanceof MatSortHeader ? column : column.matSortHeader())
        .filter(column => !!column);

      const sorter = this.sorter();

      untracked(() => {
        defs.forEach(column => {
          if (!sorter.sortables.has(column.id)) {
            (column as any)._sort = sorter;
            sorter.register(column); 
          }
        });
      });
    })
    /**
     * efecto para pasarle el data source al column select
     */
    effect(() => {
      const dataSource = this.source();
      untracked(() => {
        this.columnDefs().filter(column => column instanceof F24ColumnSelect)
          .forEach(columnSelect => {
            columnSelect.setDataSource = dataSource;
          });
      });
    });
    /**
     * efecto para sincronizar page con el data source
     */
    effect(() => {
      const dataSource = this.source();
      const page = this.page();
      if (!page) {
        return;
      }
      
      untracked(() => {
        dataSource.update({
          page: { 
            index: page.pageIndex,
            size: page.pageSize
          }
        });
      });
    });
    /**
     * efecto para sincronizar sort con el data source
     */
    effect(() => {
      const dataSource = this.source();
      const sort = this.sort();
      if (!sort) {
        return;
      }
      untracked(() => {
        dataSource.update({
          sorts: {
            [sort.active]: sort.direction
          }
        });
      });
    });
  }
  /**
   * trackBy
   */
  protected trackBy(index: number, item: T) {
    if (!this.source) {
      return item;
    }
    const id = this.source().id();
    if (typeof id === 'function') {
      return id(item);
    }

    const names = id.split('.');
    let current: any = item;
    while (names.length > 0) {
      const name = names.shift();
      if (name && name in current) {
        current = current[name];
      } else {
        return item;
      }
    }
    
    return item;
  }

  /**
   * updatePageSize
   */
  updatePageSize(size: number): void {
    const paginator = this.paginator();
    if (!paginator) {
      return;
    }
    if (this.isPagination() && this.source().pageOptions().includes(size)) {
      paginator.pageSize = size;
      paginator.page.emit();
    }
  }
}
