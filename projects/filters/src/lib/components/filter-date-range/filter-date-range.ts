import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { DateFnsAdapter } from "@angular/material-date-fns-adapter";

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { es } from 'date-fns/locale';

import { createFilterDateRangeSource, createFilterDateRangeSourceParams, F24FilterDateRangeFormSourceParams, F24FilterDateRangeSourceParams } from './filter-date-range-source';
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
            dateInput: 'dd/MM/yyyy',
        },
        display: {
          dateInput: 'dd/MM/yyyy',  // String format
          monthYearLabel: 'MMM yyyy',  // String format
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM yyyy',
        }
      }
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24FilterDateRange {
  /**
     * source 
     */
    readonly params = input(createFilterDateRangeSourceParams());
    readonly source = input(createFilterDateRangeSource());
    /**
     * inputs
     */
    readonly id = input<F24FilterDateRangeSourceParams['id']>();
    readonly dataSource = input<F24FilterDateRangeSourceParams['dataSource']>();
    readonly label = input<F24FilterDateRangeSourceParams['label']>();
    readonly appearance = input<F24FilterDateRangeSourceParams['appearance']>();

    readonly fromName = input<F24FilterDateRangeFormSourceParams['name']>();
    readonly fromDefault = input<F24FilterDateRangeFormSourceParams['default']>();
    readonly fromPlaceholder = input<F24FilterDateRangeFormSourceParams['placeholder']>();
    readonly fromForm = input<F24FilterDateRangeFormSourceParams['form']>();
    readonly fromChange = input<F24FilterDateRangeFormSourceParams['change']>();

    readonly toName = input<F24FilterDateRangeFormSourceParams['name']>();
    readonly toDefault = input<F24FilterDateRangeFormSourceParams['default']>();
    readonly toPlaceholder = input<F24FilterDateRangeFormSourceParams['placeholder']>();
    readonly toForm = input<F24FilterDateRangeFormSourceParams['form']>();
    readonly toChange = input<F24FilterDateRangeFormSourceParams['change']>();
    /**
     * constructor
     */
    constructor() {
      /**
       * efecto para asignar params
       */
      effect(() => {
        this.source()?.update({
          id: this.id(),
          dataSource: this.dataSource(),
          label: this.label(),
          appearance: this.appearance(),
          from: {
            name: this.fromName(),
            default: this.fromDefault(),
            placeholder: this.fromPlaceholder(),
            form: this.fromForm(),
            change: this.fromChange()
          },
          to: {
            name: this.toName(),
            default: this.toDefault(),
            placeholder: this.toPlaceholder(),
            form: this.toForm(),
            change: this.toChange()
          }
        }, this.params());
      });
    }
}
