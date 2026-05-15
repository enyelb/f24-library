import { afterNextRender, ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, contentChildren, effect, ElementRef, inject, input, signal, TemplateRef, untracked, viewChild, viewChildren, ViewEncapsulation } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, of, switchMap } from 'rxjs';

import { F24Dialog } from '@f24/notification';
import { F24Container, F24LayoutService, F24ResponsiveClassDirective, F24Loader } from '@f24/layout'

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
    F24Container, F24Dialog, F24ResponsiveClassDirective,
    F24Loader
],
  templateUrl: './list.html',
  styleUrl: './list.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24List<T> {
  /**
   * services
   */
  protected readonly layout = inject(F24LayoutService);
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
  readonly showHeader = input<F24ListSourceParams<T>['showHeader']>();
  readonly columns = input<F24ListSourceParams<T>['columns']>();
  /**
   * view childs
   */
  protected readonly sorter = viewChild(MatSort);
  protected readonly paginator = viewChild(MatPaginator);
  protected readonly reponsiveClass = viewChild(F24ResponsiveClassDirective);
  protected readonly viewport = viewChild(CdkVirtualScrollViewport);
  protected readonly elementList = viewChild('listContent', { read: ElementRef });
  protected readonly elementInput = viewChild('input', { read: ElementRef });
  protected readonly elementItems = viewChildren('itemContent', { read: ElementRef });
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
  /**
   * signals
   */
  protected readonly forceChangeItemSize = signal(false);
  protected readonly itemSize = computed(() => {
      /**
       * forzar a crear nuevamente el itemSize
       */
      this.forceChangeItemSize();
      /**
       * buscar el tamanio minimo pero mayor a cero
       */
      return this.elementItems().map(elementRef => elementRef.nativeElement).reduce((minHeight, elementRef) => {
        const height = elementRef.getBoundingClientRect().height;
        return height > 0 && height < minHeight ? height : minHeight;
      }, 500);
  });
  protected readonly columnItemSize = computed(() => {
    const itemSize = this.itemSize();
    const size = this.reponsiveClass()?.currentSize() ?? 'XS';
    const defaultSizes = this.layout.defaultSizes(this.source().columns(), 1);
    return itemSize / this.layout.values(defaultSizes, size);
  });
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
        showHeader: this.showHeader(),
        columns: this.columns()
      }, this.params());
    });
    /**
     * efecto para sincronizar la paginacion y el ordenamiento con el data source
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
     * efecto para observar el elemento list y en el momento que se haga visible ejecutar el metodo checkViewportSize
     * para en caso de que el vistual scroll se creo cuando el elemento no era visible, forzar que el viewport asigne 
     * nuevamente su tamanio, Nota: esto solo se ejecutara una vez porque dentro del mismo observer se deconecta
     */
    effect(() => {
      const list = this.elementList()?.nativeElement;
      if (!list) {
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          // Si al menos una parte del componente es visible
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            setTimeout(() => {
              this.viewport()?.checkViewportSize();
              this.forceChangeItemSize.set(true);
            }, 60);
            observer.disconnect();
          }
        });
      });
      observer.observe(list);
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
