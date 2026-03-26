import { Component, effect, inject, input, OnDestroy, OnInit} from '@angular/core';
import { FormControl, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { es } from 'date-fns/locale';

import { F24Icon } from '@f24/layout'

import { F24_FORM_TOKEN } from '../../form-token';
import { ControlValueAccessor } from '../../control-value';

import { F24FormErrors } from '../form-errors';

import { createFormDateSource, createFormDateSourceParams, F24FormDateSourceParams } from './form-date-source';

/**
 * CustomMomentDateAdapter
 */
class CustomMomentDateAdapter extends DateFnsAdapter {
  override getFirstDayOfWeek(): number {
    return 1;
  }
}

/**
 * MAT_DATE_FORMATS configuration
 */
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'dd/MM/yyyy', // Format for parsing input
  },
  display: {
    dateInput: 'dd/MM/yyyy', // Format for displaying in input
    monthYearLabel: 'MMM yyyy', // Format for month year label
    dateA11yLabel: 'dd/MM/yyyy', // Format for accessibility
    monthYearA11yLabel: 'MMMM yyyy', // Format for accessibility
  },
};

/**
 * FormDate
 */
@Component({
  selector: 'f24-form-date',
  standalone: true,
  imports: [
    ReactiveFormsModule, FormsModule,
    MatFormFieldModule, MatNativeDateModule, MatInputModule, MatDatepickerModule, 
    F24FormErrors, F24Icon
  ],
  templateUrl: './form-date.html',
  styleUrl: './form-date.scss',
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
      useValue: MY_DATE_FORMATS,
    },
    {
      provide: F24_FORM_TOKEN,
      useFactory: (component: F24FormDate) => component,
      deps: [F24FormDate]
    },
  ]
})
export class F24FormDate implements OnInit, OnDestroy {
  /**
   * injects
   */
  protected readonly ngControl = inject(NgControl, { optional: true, self: true });
  /**
   * source 
   */
  readonly params = input(createFormDateSourceParams());
  readonly source = input(createFormDateSource());
  /**
   * inputs
   */
  readonly label = input<F24FormDateSourceParams['label']>();
  readonly appearance = input<F24FormDateSourceParams['appearance']>();
  readonly name = input<F24FormDateSourceParams['name']>();
  readonly icon = input<F24FormDateSourceParams['icon']>();
  readonly default = input<F24FormDateSourceParams['default']>();
  readonly placeholder = input<F24FormDateSourceParams['placeholder']>();
  readonly form = input<F24FormDateSourceParams['form']>();
  readonly type = input<F24FormDateSourceParams['type']>();
  readonly change = input<F24FormDateSourceParams['change']>();
  readonly minDate = input<F24FormDateSourceParams['minDate']>();
  readonly maxDate = input<F24FormDateSourceParams['maxDate']>();
  /**
   * constructor
   */
  constructor() {
    /**
     * efecto para asignar params
     */
    effect(() => {
      this.source()?.update({
        label: this.label(),
        appearance: this.appearance(),
        name: this.name(),
        icon: this.icon(),
        default: this.default(),
        placeholder: this.placeholder(),
        form: this.form(),
        type: this.type(),
        change: this.change(),
        minDate: this.minDate(),
        maxDate: this.maxDate()
      }, this.params());
    });
    /**
     * value ng control
     */
    if (this.ngControl) {
      this.ngControl.valueAccessor = new ControlValueAccessor();
    }
  }
  /**
   * ngOnInit
   */
  ngOnInit(): void {
    if (this.ngControl && this.ngControl.control) {
      this.source().update({ form: this.ngControl.control as FormControl<Date | null> });
    }
  }
  /**
   * ngOnDestroy
   */
  ngOnDestroy(): void {
    if (this.ngControl && this.ngControl.control) {
      this.ngControl.valueAccessor = null;
    }
  }
}