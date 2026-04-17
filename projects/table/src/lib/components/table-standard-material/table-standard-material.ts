import { ChangeDetectionStrategy, Component, computed, ElementRef, input, viewChild, viewChildren, ViewEncapsulation } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, of, switchMap } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';

import { F24DataSource } from '@f24/data';
import { F24Loader } from '@f24/layout';

import { F24Column } from '../column/column';
import { F24ColumnSelect } from '../column-select/column-select';

/**
 * F24TableStandardMaterial
 */
@Component({
  selector: 'f24-table-standard-material',
  imports: [
    NgTemplateOutlet, 
    MatTableModule, MatIconModule, MatSortModule, MatTooltipModule, MatCheckboxModule, 
    F24Loader
  ],
  templateUrl: './table-standard-material.html',
  styleUrl: './table-standard-material.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24TableStandardMaterial<T> {
  /**
   * dataSource
   */
  readonly source = input.required<F24DataSource<T>>();
  /**
   * columns
   */
  readonly columns = input.required<readonly F24Column[]>();
  readonly columnSelects = input.required<readonly F24ColumnSelect<T>[]>();
  /**
   * mat sorter
   */
  readonly sorter = viewChild.required(MatSort);
  readonly headElement = viewChild.required('f24TableHead', { read: ElementRef });
  readonly tdsElement = viewChildren('f24TableCell', { read: ElementRef });
  /**
   * displayed
   */
  readonly displayed = computed(() => {
   const columns = this.columns();
    return {
      headers: columns.filter(column => column.isHeader() && !column.isCell()).map(column => column.column()),
      columns: columns.filter(column => column.isCell()).map(column => column.column()),
      footers: columns.filter(column => column.isFooter()).map(column => column.column()),
    }
  });
  /**
   * sort
   */
  readonly sort = toSignal(
    toObservable(this.sorter).pipe(
      distinctUntilChanged(),
      switchMap(s => s?.sortChange ?? of((null))),
      takeUntilDestroyed()
    ),
    { initialValue: null }
  );
}
