
import { ChangeDetectionStrategy, Component, effect, input, OnDestroy, OnInit, untracked } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { createFilterSourceInput, F24FilterSourceInputParams } from './../../source/input-source';

/**
 * F24FilterInputComponent
 */
@Component({
  selector: 'f24-filter-input',
  styleUrls: ['filter-input.scss'],
  templateUrl: 'filter-input.html',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24FilterInput<T = string | number> implements OnInit, OnDestroy {
  /**
   * params
   */
  readonly params = input<F24FilterSourceInputParams<T>>();
  /**
   * source 
   */
  readonly source = input(createFilterSourceInput(this.params()));
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
