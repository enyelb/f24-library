import { Component, input, effect, untracked, contentChildren, afterNextRender, ChangeDetectionStrategy, computed, ElementRef, signal, viewChild, viewChildren, ViewEncapsulation } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatRow, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { distinctUntilChanged, of, switchMap } from 'rxjs';

import { F24Loader } from '@f24/layout';
import { createDataSource, createDataSourceParams } from '@f24/data';

import { F24ColumnSelect } from '../column-select/column-select';
import { F24Column } from '../column/column';
import { F24TableScroll } from '../table-scroll/table-scroll';


/**
 * Table
 */
@Component({
  selector: 'f24-table',
  styleUrls: ['table.scss'],
  templateUrl: 'table.html',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    MatSortModule, MatIconModule, MatTableModule, MatProgressBarModule, MatPaginatorModule, MatTooltipModule,
    F24Loader, F24TableScroll
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
  protected readonly sorter = viewChild.required(MatSort);
  protected readonly paginator = viewChild(MatPaginator);
  protected readonly rowElements = viewChildren(MatRow, { read: ElementRef });
  protected readonly virtualScroll = viewChild(CdkVirtualScrollViewport, { read: ElementRef });

  protected readonly itemSize = signal(52);

  /**
   * content childrens
   */
  protected readonly columns = contentChildren(F24Column);
  protected readonly selects = contentChildren(F24ColumnSelect);

  /**
   * displayedHeaders
   */
  protected readonly displayed = computed(() => {
    const row = this.columns();
    const selects = this.selects();
    return {
      headers: row.filter(column => column.isHeader() && !column.isCell()).map(column => column.column()),
      columns: row.filter(column => column.isCell()).map(column => column.column()).concat(selects.map(column => column.column())),
      footers: row.filter(column => column.isFooter()).map(column => column.column()),
    }
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
    effect((onCleanup) => {
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
     * efecto para pasarle el data source al column select
     */
    effect(() => {
      const dataSource = this.source();
      untracked(() => {
        this.selects().forEach(columnSelect => {
          columnSelect.setDataSource = dataSource;
        });
      });
    });
    /**
     * efecto para sincronizar page con el data source
     */
    effect(() => {
      const dataSource = this.source();
      const sort = this.sort();
      const page = this.page();
      
      untracked(() => {
        dataSource.update({
          page: page ? { index: page.pageIndex, size: page.pageSize } : undefined,
          sorts: sort ? { [sort.active]: sort.direction } : undefined
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
    if (this.isPagination() && this.source().pageOptions().includes(size)) {
      paginator.pageSize = size;
      paginator.page.emit();
    }
  }
}
