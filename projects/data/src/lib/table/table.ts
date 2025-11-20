import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, ContentChildren, EventEmitter, inject, Input, OnDestroy, OnInit, Output, QueryList, signal, ViewChild, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';

import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatColumnDef, MatFooterRowDef, MatHeaderRowDef, MatTable, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

import { merge, Subscription } from 'rxjs';

import { APIService } from '@f24/api';

import { DataSource } from '../source';

/**
 * Table
 */
@Component({
  selector: 'app-table',
  styleUrls: ['table.scss'],
  templateUrl: 'table.html',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule, MatTableModule, MatProgressBarModule, MatPaginatorModule
  ],
})
export class Table<T> implements AfterContentInit, AfterViewInit, OnInit, OnDestroy {

  /**
   * change
   */
  readonly change = inject(ChangeDetectorRef);

  //CONFIG
  /**
   * sticky
   */
  @Input() isSticky: boolean = true;

  /**
   * headerDisabled
   */
  @Input() headerDisabled: boolean = false;

  /**
   * displayedTitlesColumns
   */
  @Input() displayedTitlesColumns: string[] = [];

  /**
   * displayedFooterTitlesColumns
   */
  @Input() displayedFooterTitlesColumns: string[] = [];

  /**
   * dataSource
   */
  @Input() dataSource!: DataSource<T>;

  //PAGINATION
  /**
   * pageSizes
   */
  @Input() pageSizes: number[] = [5, 10, 25, 100];

  /**
   * pageSizes
   */
  @Input() isPageSizeMaxLength: boolean = true;

  /**
   * pageSizes
   */
  @Input() pageSize: number = 10;

  /**
   * isPagination
   */
  @Input() isPagination: boolean = true;

  //FILTER INPUT
  /**
   * noResultLabel
   */
  @Input() noResultLabel: string = "No data matching the filter";

  /**
   * filters
   */
  @Input() filters: {[key: string]: FormControl} = {};

  /**
   * forms
   */
  @Input() sorts: {[key: string]: FormControl} = {};

  /**
   * changeData
   */
  @Output() changeData = new EventEmitter<T[]>();

  /**
   * sortFn
   */
  @Input() sortFn?: (name: string, direction: string, data: T[]) => T[];

  /**
   * pageSizeMaxLength
   */
  protected pageSizeMaxLength: number = 100000;

  /**
   * pageSizeOptions
   */
  protected pageSizeOptions: number[] = [];

  /**
   * displayedColumns
   */
  protected displayedColumns: string[] = [];

  /**
   * showFooterColumns
   */
  protected showFooterColumns: boolean = false;

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
   * sort
   */
  protected sort!: MatSort;

  /**
   * table
   */
  @ViewChild(MatTable, {static: true}) table!: MatTable<T>;

  /**
   * paginator
   */
  @ViewChild(MatPaginator) protected paginator!: MatPaginator;

  /**
   * sortHeaderDefs
   */
  @ContentChildren(MatSortHeader) sortHeaders!: QueryList<MatSortHeader>;

  /**
   * headerRowDefs
   */
  @ContentChildren(MatHeaderRowDef) headerRowDefs!: QueryList<MatHeaderRowDef>;

  /**
   * footerRowDefs
   */
  @ContentChildren(MatFooterRowDef) footerRowDefs!: QueryList<MatFooterRowDef>;

  /**
   * columnDefs
   */
  @ContentChildren(MatColumnDef) columnDefs!: QueryList<MatColumnDef>;

  /**
   * ngOnInit
   */
  ngOnInit(): void {
    this.pageSizeOptions = this.isPageSizeMaxLength ? [... this.pageSizes, this.pageSizeMaxLength] : this.pageSizes;

    //this.table.dataSource = this.dataSource;
  }

  /**
   * ngAfterContentInit
   */
  ngAfterContentInit() {
    this.columnDefs.forEach(columnDef => {
      this.table.addColumnDef(columnDef);
      if (columnDef.headerCell && !columnDef.cell) {
        if(!this.displayedTitlesColumns.includes(columnDef.name)) {
          this.displayedTitlesColumns.push(columnDef.name)
        }
      } else if (columnDef.footerCell) {
        if(!this.displayedFooterTitlesColumns.includes(columnDef.name)) {
          this.displayedFooterTitlesColumns.push(columnDef.name)
        }
      } else {
        if(!this.displayedColumns.includes(columnDef.name)) {
          this.displayedColumns.push(columnDef.name);
        }
      }
    });


    this.headerRowDefs.forEach(headerRowDef => this.table.addHeaderRowDef(headerRowDef));
    this.footerRowDefs.forEach(footerRowDef => this.table.addFooterRowDef(footerRowDef));

    this.subscriptionHeaderSort = this.sortHeaders.changes.subscribe((sortHeaders: QueryList<MatSortHeader>) => {
      if (sortHeaders.first) {
        this.sort = sortHeaders.first._sort;
        //this.subscriptionSortChange = this.sort.sortChange.subscribe(e => this.sortChange(e));
      }
    });
  }

  /**
   * ngAfterViewInit
   */
  ngAfterViewInit(): void {

    const filters = Object.values(this.filters).map(filter => filter.valueChanges);
    const sorts = Object.values(this.sorts).map(sort => sort.valueChanges);

    this.subscriptionFilters = merge(... filters).subscribe(() => {
      this.dataSource.filter(APIService.filters(this.filters));
    });
    this.subscriptionSorts = merge(... sorts).subscribe(() => {
      this.dataSource.sort(APIService.sorts(this.sorts));
    });
    if (this.paginator) {
      this.dataSource.page(1, this.pageSize);
      this.subscriptionPage = this.paginator.page.subscribe( () => {
        this.dataSource.page(
          this.paginator.pageIndex + 1,
          this.paginator.pageSize
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
    if(this.paginator) {
      return this.paginator.pageSize;
    } else if (this.pageSizes) {
      return this.pageSizes[0];
    }

    return 25;
  }

  /**
   * paginatorPageIndex
   */
  protected paginatorPageIndex(): number {
    if(this.paginator) {
      return this.paginator.pageIndex + 1;
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
      this.dataSource.data(data)
    }
  }

  /**
   * updatePageSize
   */
  updatePageSize(size: number): void {
    if (this.isPagination && this.pageSizes.includes(size)) {
      this.paginator.pageSize = size;
      this.paginator.page.emit();
    }
  }
}
