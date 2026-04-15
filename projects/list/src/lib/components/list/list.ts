import { afterNextRender, ChangeDetectionStrategy, Component, contentChild, contentChildren, effect, ElementRef, inject, input, signal, TemplateRef, untracked, viewChild, viewChildren, ViewEncapsulation } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, of, switchMap } from 'rxjs';

import { DialogService } from '@f24/notification';
import { F24Container } from '@f24/layout'

import { createListSource, createListSourceParams, F24ListSourceParams } from '../list/list-source';

import { F24ListItem } from '../../directives/list-item';

/**
 * F24List
 */
@Component({
  selector: 'f24-list',
  imports: [
    NgTemplateOutlet, ScrollingModule, 
    MatPaginatorModule, MatProgressBarModule, MatIconModule, MatButtonModule,
    F24Container
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24List<T> {
  /**
   * 
   */
  readonly notifcation = {
    dialog: inject(DialogService),
  }
  /**
   * params
   */
  readonly params = input(createListSourceParams<T>());
  readonly source = input(createListSource(this.params()));
  /**
   * inputs
   */
  readonly filterKey = input<F24ListSourceParams<T>['filterKey']>();
  readonly filterLabel = input<F24ListSourceParams<T>['filterLabel']>();
  readonly label = input<F24ListSourceParams<T>['label']>();
  readonly dataSource = input<F24ListSourceParams<T>['dataSource']>();
  /**
   * view childs
   */
  protected readonly sorter = viewChild(MatSort);
  protected readonly paginator = viewChild(MatPaginator);
  protected readonly elementItems = viewChildren('itemContent', { read: ElementRef });
  protected readonly elementInput = viewChild('input', { read: ElementRef });
  protected readonly templateFilters = viewChild('filters', { read: TemplateRef });
  /**
   * itemTemplate este template *f24-item="let item"
   */
  protected readonly itemTemplate = contentChildren(F24ListItem);
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

  protected readonly itemSize = signal(0);

  /**
   * constructor
   */
  constructor() {
    /**
     * conectar el data source despues de iniciar las vista
     */
    afterNextRender(() => {
      this.source().dataSource().connect();
    });

    /**
     * efecto para asignar params
     */
    effect(() => {
      this.source().update({
        filterKey: this.filterKey(),
        filterLabel: this.filterLabel(),
        label: this.label(),
        dataSource: this.dataSource(),
      }, this.params());
    });
    /**
     * efecto para sincronizar page con el data source
     */
    effect(() => {
      const dataSource = this.source().dataSource();
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
      const elements = this.elementItems().map(elementRef => elementRef.nativeElement);
      
      untracked(() => {
        const newItemSize = elements.reduce((height, elementRef) => {
          return height > elementRef.getBoundingClientRect().height ? height : elementRef.getBoundingClientRect().height;
        }, this.itemSize());
        if (this.itemSize() == newItemSize) {
          console.log(this.itemSize());
          return;
        }
        this.itemSize.set(newItemSize);
      });
    });
  }
  /**
   * showInput
   */
  protected showInput() {
    const input = this.elementInput()?.nativeElement;
    if (!input) {
      return;
    }
    if (input.matches(':focus')) {
      input.blur();
    } else {
      input.focus();
    }
  }
  /**
   * showFilters
   */
  protected showFilters() {
    const filters = this.templateFilters();
    if (!filters) {
      return;
    }
    this.notifcation.dialog.open(filters, {});
  }
  /**
   * changeInput
   */
  protected changeInput(event: any) {
    const key  = this.source().filterKey();
    const source = this.source().dataSource();
    if (!key) {
      return;
    }
    source.update({
      filters: { [key]: event.target.value }
    });
  }
}
