import { ChangeDetectionStrategy, Component, effect, input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { DateFnsAdapter } from "@angular/material-date-fns-adapter";

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { F24DataSource } from '@f24/data';

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
   * id para guardar el filtro en local storage
   */
  readonly id = input('');
  /**
   * dataSource variable para pasar el filtro 
   * al datasource cuando cambie este input 
   */
  readonly dataSource = input<F24DataSource<any>>();
  /**
   * name este es el nombre que se pasa al datasource
   */
  readonly nameStart = input<string>();
  /**
   * name este es el nombre que se pasa al datasource
   */
  readonly nameEnd = input<string>();
  /**
   * label
   */
  readonly label = input('Enter a date range');
  /**
   * labelCancel
   */
  readonly labelCancel = input('Cancel');
  /**
   * labelApply
   */
  readonly labelApply = input('Apply');
  /**
   * placeholderStart
   */
  readonly placeholderStart = input('Start date');
  /**
   * placeholderEnd
   */
  readonly placeholderEnd = input('End date');
  /**
   * defaultStart
   */
  readonly defaultStart = input(format(new Date(), "yyyy") + '-01-01');
  /**
   * defaultEnd
   */
  readonly defaultEnd = input(format(new Date(), "yyyy") + '-12-31');
  /**
   * formStart
   */
  readonly formStart = input(new FormControl(this.defaultStart()));
  /**
   * formEnd
   */
  readonly formEnd = input(new FormControl(this.defaultEnd()));
  /**
   * isTouchUi
   */
  readonly isTouchUi = input(false);
  /**
   * appearance
   */
  readonly appearance = input<'fill' | 'outline'>('outline');
  /**
   * change
   */
  readonly change = input<any>();
  /**
   * subscriptionStart
   */
  private subscriptionStart? : Subscription;
  /**
   * subscriptionEnd
   */
  private subscriptionEnd? : Subscription;
  /**
   * constructor
   */
  constructor() {
    /**
     * efecto para asignar el valor si ya en local storage
     */
    effect(() => {
      /**
       * validar si el id existe
       */
      const id = this.id();
      if (!id) {
        return;
      }
      /**
       * obtener los filtros guardados en local storage
       */
      const filters = JSON.parse(localStorage.getItem("filters") ?? '{}');
      /**
       * validar si el id existe en los filtros
       */
      if (!(id in filters)) {
        return;
      }
      /**
       * validar si existe el valor de la fecha de inicio
       */
      const start = filters[id].start;
      if (start) {
        this.formStart().setValue(start);
      }
      /**
       * validar si existe el valor de la fecha de fin
       */
      const end = filters[id].end;
      if (end) {
        this.formEnd().setValue(end);
      }
    });
  }
  /**
   * ngOnInit
   */
  ngOnInit() {
    /**
     * suscripcion para ver si el valor de form start cambia
     */
    this.subscriptionStart = this.formStart().valueChanges.subscribe(value => {
      /**
       * obtener los filtros guardados en local storage
       */
      const filters = JSON.parse(localStorage.getItem("filters") ?? '{}');
      /**
       * validar si el id existe en los filtros y guardar los filtros
       */
      const id = this.id();
      if (id) {
        filters[id] = {
          start: value,
          end: this.formEnd().value ?? ''
        };
        localStorage.setItem("filters", JSON.stringify(filters));
      }
      /**
       * si la variable name y datasource existen, setear el valor del filtro
       */
      const name = this.nameStart();
      const dataSource = this.dataSource();
      if (dataSource && name) {
        dataSource.filter(name, value);

      }
    });
    /**
     * suscripcion para ver si el valor de form start cambia
     */
    this.subscriptionStart = this.formEnd().valueChanges.subscribe(value => {
      /**
       * obtener los filtros guardados en local storage
       */
      const filters = JSON.parse(localStorage.getItem("filters") ?? '{}');
      /**
       * validar si el id existe en los filtros y guardar los filtros
       */
      const id = this.id();
      if (id) {
        filters[id] = {
          start: this.formStart().value ?? '',
          end: value
        };
        localStorage.setItem("filters", JSON.stringify(filters));
      }
      /**
       * si la variable name y datasource existen, setear el valor del filtro
       */
      const name = this.nameEnd();
      const dataSource = this.dataSource();
      if (dataSource && name) {
        dataSource.filter(name, value);
      }
    });
  }
  /**
   * ngOnDestroy
   */
  ngOnDestroy(): void {
    if (this.subscriptionStart) {
      this.subscriptionStart.unsubscribe();
    }
    if (this.subscriptionEnd) {
      this.subscriptionEnd.unsubscribe();
    }
  }
}
