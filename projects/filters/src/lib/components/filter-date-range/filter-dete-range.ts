import { ChangeDetectionStrategy, Component, effect, input, OnDestroy, OnInit, untracked } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { DateFnsAdapter } from "@angular/material-date-fns-adapter";

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { es } from 'date-fns/locale';

import { createFilterSourceDateRange, createFilterSourceDateRangeParams } from '../../source/date-range-source';

/**
 * CustomMomentDateAdapter
 */
class CustomMomentDateAdapter extends DateFnsAdapter {
  override getFirstDayOfWeek(): number {
    return 1;
  }
}
/**
 * F24FilterDateRangeComponent
 */
@Component({
  selector: 'f24-filter-date-range',
  styleUrls: ['filter-date-range.scss'],
  templateUrl: 'filter-date-range.html',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, MatInputModule, MatNativeDateModule, MatDatepickerModule, MatButtonModule, MatIconModule
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: CustomMomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: es,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
            dateInput: 'MM/dd/yyyy',
        },
        display: {
          dateInput: 'MM/dd/yyyy',  // String format
          monthYearLabel: 'MMM yyyy',  // String format
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM yyyy',
        }
      }
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24FilterDateRange implements OnInit, OnDestroy {
  /**
   * params
   */
  readonly params = input(createFilterSourceDateRangeParams());
  /**
   * source 
   */
  protected readonly source = input(createFilterSourceDateRange(this.params()));
  /**
   * constructor
   */
  constructor() {
    /**
     * efecto para asignar los parametros al source
     */
    effect(() => {
      /**
       * validar si los parametros existen
       */
      const params = this.params();
      if (!params) {
        return;
      }
      untracked(() => {
        this.source().update(params)
        this.source().init();
      });
    });
  }
  /**
   * ngOnInit
   */
  ngOnInit() {
    this.source().init();
  }
  /**
   * ngOnDestroy
   */
  ngOnDestroy(): void {
    this.source().destroy();
  }
}
