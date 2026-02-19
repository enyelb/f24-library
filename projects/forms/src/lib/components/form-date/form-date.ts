import { Component, input} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { es } from 'date-fns/locale';

import { createFormDateSource, createFormDateSourceParams } from '../source/date-source';
import { F24DateComponent } from '../template/date-component';

import { FormErrors } from '../form-errors';

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
    dateDate: ['dd/MM/yyyy'], // Format for parsing input
  },
  display: {
    dateDate: 'dd/MM/yyyy', // Format for displaying in input
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
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatIconModule, FormErrors],
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
      }
  ]
})
export class F24FormDate extends F24DateComponent {
  /**
   * source 
   */
  readonly params = input(createFormDateSourceParams());
  readonly source = input(createFormDateSource());
  /**
   * constructor
   */
  constructor() {
    super();
  }
}

