
import { ChangeDetectionStrategy, Component, effect, input, OnDestroy, OnInit, untracked } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { createFilterSourceInput, createFilterSourceInputParams, F24FilterSourceInputType } from './../../source/input-source';

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
export class F24FilterInput<T extends F24FilterSourceInputType> implements OnInit, OnDestroy {
  /**
   * params
   */
  readonly params = input(createFilterSourceInputParams<T>());
  /**
   * source 
   */
  protected readonly source = input(createFilterSourceInput(this.params()));
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
        this.source().update(params);
        this.source().init();
      });
    }, { debugName: 'F24FilterInput' });
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
