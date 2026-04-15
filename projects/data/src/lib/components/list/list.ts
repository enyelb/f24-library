import { afterNextRender, ChangeDetectionStrategy, Component, contentChild, effect, ElementRef, input, signal, untracked, viewChild, viewChildren, ViewEncapsulation } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, of, switchMap } from 'rxjs';

import { createDataSource, createDataSourceParams } from '../../source/data-source';

import { F24ItemDirective } from '../../directives/item';

/**
 * F24List
 */
@Component({
  selector: 'f24-list',
  imports: [
    NgTemplateOutlet, ScrollingModule,
    MatPaginatorModule, MatProgressBarModule
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24List<T> {
  /**
   * params
   */
  readonly params = input(createDataSourceParams<T>());
  readonly source = input(createDataSource(this.params()));
  /**
   * view childs
   */
  protected readonly sorter = viewChild(MatSort);
  protected readonly paginator = viewChild(MatPaginator);
  protected readonly itemElements = viewChildren('itemContent', { read: ElementRef });
  /**
   * itemTemplate este template *f24-item="let item"
   */
  protected readonly itemTemplate = contentChild(F24ItemDirective);
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
   * inputs
   */
  readonly isPagination = input(true);

  protected readonly itemSize = signal(0);

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
    /**
     * controlar la velocidad del scroll
     */
    effect(() => {
      const elements = this.itemElements().filter((elementRef, index) => index === 0).map(elementRef => elementRef.nativeElement);
      
      untracked(() => {
        const newItemSize = elements.reduce((height, elementRef) => {
          return height > elementRef.getBoundingClientRect().height ? height : elementRef.getBoundingClientRect().height;
        }, this.itemSize());
        if (this.itemSize() == newItemSize) {
          console.log(this.itemSize());
          return;
        }
        console.log(this.itemSize());
        this.itemSize.set(newItemSize);
      });
    });
  }
}
