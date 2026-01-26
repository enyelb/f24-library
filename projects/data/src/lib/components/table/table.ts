import { computed, OnInit, output, viewChild, ViewEncapsulation } from '@angular/core';
import { AfterViewInit, Component, OnDestroy, input, effect, untracked, contentChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';

import { MatSortHeader } from '@angular/material/sort';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

import { merge, Subscription } from 'rxjs';

import { F24APIService } from '@f24/api';

import { F24DataSource } from '../../source/data-source';
import { F24Column } from '../column/column';
import { F24_COLUMN_DEF_TOKEN, F24_FOOTER_ROW_DEF_TOKEN, F24_HEADER_ROW_DEF_TOKEN } from '../../column-token';

/**
 * Table
 */
@Component({
  selector: 'f24-table',
  styleUrls: ['table.scss'],
  templateUrl: 'table.html',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule, MatTableModule, MatProgressBarModule, MatPaginatorModule
  ],
  encapsulation: ViewEncapsulation.None
})
export class F24Table<T> implements OnInit, AfterViewInit, OnDestroy {

  //CONFIG
  /**
   * inputs
   */
  readonly isSticky = input(true);
  readonly dataSource = input.required<F24DataSource<T>>();
  readonly pageSize = input(10);
  readonly pageSizes = input([5, 10, 25, 100]);
  readonly isPageSizeMaxLength = input(true);
  readonly isPagination = input(true);
  readonly filters = input<{[key: string]: FormControl}>({});
  readonly sorts = input<{[key: string]: FormControl}>({});
  readonly noResultLabel = input('No data matching the filter');
  readonly sortFn = input<(name: string, direction: string, data: T[]) => T[]>();
  readonly changeData = output<T[]>();

  //PAGINATION

  //FILTER INPUT

  /**
   * pageSizeMaxLength
   */
  protected pageSizeMaxLength: number = 100000;

  /**
   * subscriptionHeaderSort
   */
  protected subscriptionHeaderSort!: Subscription;

  /**
   * subscriptionPage
   */
  protected subscriptionPage!: Subscription;

  /**
   * subscriptionFilters
   */
  protected subscriptionFilters!: Subscription;

  /**
   * subscriptionSorts
   */
  protected subscriptionSorts!: Subscription;

  /**
   * subscriptionSortChange
   */
  protected subscriptionSortChange!: Subscription;

  /**
   * view childs
   */
  protected readonly table = viewChild.required(MatTable);
  protected readonly paginator = viewChild(MatPaginator);

  /**
   * content childrens
   */
  protected readonly sortHeaders = contentChildren(MatSortHeader);
  protected readonly headerRowDefs = contentChildren(F24_HEADER_ROW_DEF_TOKEN);
  protected readonly footerRowDefs = contentChildren(F24_FOOTER_ROW_DEF_TOKEN);
  protected readonly columnDefs = contentChildren(F24_COLUMN_DEF_TOKEN);

  /**
   * displayed
   */
  protected readonly displayed = computed(() => {
    const defs = this.columnDefs()
      .map(column => column instanceof F24Column ? column.matColumnDef() : column)
      .filter(column => !!column);

    const columns: string[] = [], header: string[] = [], footer: string[] = [];
    
    untracked(() => defs.forEach(columnDef => {
      this.table().addColumnDef(columnDef);
      if (columnDef.headerCell && !columnDef.cell) {
        header.push(columnDef.name);
      } else if (columnDef.footerCell) {
        footer.push(columnDef.name);
      } else {
        columns.push(columnDef.name);
      }
    }));
    
    return { columns, header, footer }
  });

  /**
   * pageSizeOptions
   */
  protected readonly pageSizeOptions = computed(() => {
    if (this.isPageSizeMaxLength()) {
      return [...this.pageSizes(), this.pageSizeMaxLength];
    }
    return this.pageSizes();
  })

  /**
   * constructor
   */
  constructor() {
    /**
     *  Headers
     */
    effect(() => {
      const defs = this.headerRowDefs()
        .map(column => column instanceof F24Column ? column.matHeaderRowDef() : column)
        .filter(column => !!column);
      untracked(() => {
        defs.forEach(headerRowDef => this.table().addHeaderRowDef(headerRowDef))
      });
    });
    /**
     * Footers
     */
    effect(() => {
      const defs = this.footerRowDefs()
        .map(column => column instanceof F24Column ? column.matFooterRowDef() : column)
        .filter(column => !!column);

      untracked(() => {
        console.log(defs);
        defs.forEach(footerRowDef => this.table().addFooterRowDef(footerRowDef));
      });
    });
    /**
     * Sorts
     */
    effect(() => {
      const sorts = this.sortHeaders();
    });
    /**
     * dataSource
     */
    effect(() => {
      this.dataSource().filter(F24APIService.filters(this.filters()));
      this.dataSource().sort(F24APIService.sorts(this.sorts()));
    });

  }

  /**
   * ngAfterViewInit
   */
  ngOnInit(): void {
    const filters = Object.values(this.filters()).map(filter => filter.valueChanges);
    const sorts = Object.values(this.sorts()).map(sort => sort.valueChanges);

    this.subscriptionFilters = merge(... filters).subscribe(() => {
      this.dataSource().filter(F24APIService.filters(this.filters()));
    });
    this.subscriptionSorts = merge(... sorts).subscribe(() => {
      this.dataSource().sort(F24APIService.sorts(this.sorts()));
    });
  }

  /**
   * ngAfterViewInit
   */
  ngAfterViewInit(): void {
    const paginator = this.paginator();
    if (paginator) {
      this.dataSource().page(1, this.pageSize());
      this.subscriptionPage = paginator.page.subscribe( () => {
        this.dataSource().page(
          paginator.pageIndex + 1,
          paginator.pageSize
        );
      });
    }
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy(): void {
    if(this.subscriptionFilters) {
      this.subscriptionFilters.unsubscribe();
    }

    if(this.subscriptionSorts) {
      this.subscriptionSorts.unsubscribe();
    }

    if(this.subscriptionHeaderSort) {
      this.subscriptionHeaderSort.unsubscribe();
    }

    if(this.subscriptionSortChange) {
      this.subscriptionSortChange.unsubscribe();
    }

    if(this.subscriptionPage) {
      this.subscriptionPage.unsubscribe();
    }
  }


  /**
   * paginatorPageSize
   */
  protected paginatorPageSize(): number {
    const paginator = this.paginator();
    if(paginator) {
      return paginator.pageSize;
    } 
    
    if (this.pageSizes) {
      return this.pageSizes()[0];
    }

    return 25;
  }

  /**
   * paginatorPageIndex
   */
  protected paginatorPageIndex(): number {

    const paginator = this.paginator();
    if(paginator) {
      return paginator.pageIndex + 1;
    }

    return 1;
  }

  /**
   * sortChange
   */
  /*sortChange(event: any): void {
    for(const [_, value] of Object.entries(this.sorts)) {
      value.setValue('', { emitEvent: false });
    }

    for(const [name, value] of Object.entries(this.sorts)) {
      if (name === event.active) {
        value.setValue(event.direction);
        return;
      }
    }

    if(this.sortFn) {
      const data = this.sortFn(event.active, event.direction, this.dataSource.data);
      this.createDataSort(data);
    }
  }*/

  /**
   * refresh
   */
  refresh(data?: T[]): void {
    if (data) {
      this.dataSource().data(data)
    }
  }

  /**
   * updatePageSize
   */
  updatePageSize(size: number): void {
    const paginator = this.paginator();
    if (!paginator) {
      return;
    }
    if (this.isPagination() && this.pageSizes().includes(size)) {
      paginator.pageSize = size;
      paginator.page.emit();
    }
  }
}
