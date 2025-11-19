import { CommonModule } from '@angular/common';

import { Component, OnInit, inject, OnDestroy, input } from '@angular/core';
import { NgControl, ReactiveFormsModule, AbstractControl } from '@angular/forms';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { format } from "date-fns";
import { es } from 'date-fns/locale';

import { ControlValueAccessor } from '../control-value';
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
    dateInput: ['dd/MM/yyyy'], // Format for parsing input
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
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatIconModule, FormErrors],
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
export class FormDate extends ControlValueAccessor implements OnInit, OnDestroy {
  /**
   * inputs
   */
  public label = input<string>('');
  public placeholder = input<string>('');
  public formControl = input<AbstractControl | null>(null);

  /**
   * injects
   */
  private ngControl = inject(NgControl, {
    optional: true,
    self: true,
  });


  /**
   * constructor
   */
  constructor() {
    super();

    // Configurar el value accessor
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  /**
   * ngOnInit
   */
  ngOnInit(): void {
    this.init(this.ngControl, this.formControl());

    if (!this.control().value) {
      this.control().setValue(format(new Date(), "yyyy-MM-dd"));
    }
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroy(this.ngControl);
  }
}

