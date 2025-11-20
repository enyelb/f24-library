import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { DateFnsAdapter } from "@angular/material-date-fns-adapter";

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { F24LayoutService } from '@f24/layout';

import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { Subscription } from 'rxjs';

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
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatDatepickerModule, MatButtonModule, MatIconModule],
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
            dateInput: [format]
          },
          display: {
            dateInput: format,
            monthYearLabel: 'MMM yyyy',
            dateA11yLabel: 'LL',
            monthYearA11yLabel: 'MMMM yyyy',
          }
        }
      }
  ]
})
export class F24FilterDateRange implements OnInit, OnDestroy {

  /**
   * services
   */
  layout = inject(F24LayoutService);

  /**
   * id
   */
  @Input() id : string = '';

  /**
   * label
   */
  @Input() label: string = 'Enter a date range';

   /**
   * labelCancel
   */
   @Input() labelCancel: string = 'Cancel';

  /**
   * labelApply
   */
  @Input() labelApply: string = 'Apply';

  /**
   * placeholderStart
   */
  @Input() placeholderStart: string = 'Start date';

  /**
   * defaultStart
   */
  @Input() defaultStart: any = format(new Date(), "yyyy") + '-01-01';

  /**
   * formStart
   */
  @Input() formStart!: FormControl;

  /**
   * placeholderEnd
   */
  @Input() placeholderEnd: string = 'End date';

  /**
   * defaultEnd
   */
  @Input() defaultEnd: any = format(new Date(), "yyyy") + '-12-31';

  /**
   * appearance
   */
  @Input() appearance: 'fill' | 'outline' = 'outline';

  /**
   * formEnd
   */
  @Input() formEnd!: FormControl;

  /**
   * subscriptionStart
   */
  private subscriptionStart? : Subscription;

  /**
   * subscriptionEnd
   */
  private subscriptionEnd? : Subscription;


  /**
   * ngOnInit
   */
  ngOnInit() {

    if (!this.formStart) {
      this.formStart = new FormControl(this.defaultStart);
    }

    if (!this.formEnd) {
      this.formEnd = new FormControl(this.defaultEnd);
    }

    const filters = JSON.parse(localStorage.getItem("filters") ?? '{}');

    if (this.id) {
      if (filters[this.id]) {
        if (filters[this.id].start) {
          this.formStart.setValue(filters[this.id].start);
        }
        if (filters[this.id].end) {
          this.formEnd.setValue(filters[this.id].end);
        }
      }

      this.subscriptionStart = this.formStart.valueChanges.subscribe(value => {
        const filters = JSON.parse(localStorage.getItem("filters") ?? '{}');
        filters[this.id] = {
          start: value,
          end: this.formEnd.value ?? ''
        }
        localStorage.setItem("filters", JSON.stringify(filters));
      });

      this.subscriptionEnd = this.formEnd.valueChanges.subscribe(value => {
        const filters = JSON.parse(localStorage.getItem("filters") ?? '{}');
        filters[this.id] = {
          start: this.formStart.value ?? '',
          end: value
        }
        localStorage.setItem("filters", JSON.stringify(filters));
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptionStart) {
      this.subscriptionStart.unsubscribe();
    }
    if (this.subscriptionEnd) {
      this.subscriptionEnd.unsubscribe();
    }
  }
}
