import { ChangeDetectionStrategy, Component, effect, input, OnDestroy, OnInit, untracked } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MtxSelectModule } from '@ng-matero/extensions/select';

import { createFilterSourceSelect, F24FilterSourceSelectParams, F24FilterSourceSelectType } from '../../source/select-source';

/**
 * F24FilterSelectComponent
 */
@Component({
  selector: 'f24-filter-select',
  styleUrls: ['filter-select.scss'],
  templateUrl: 'filter-select.html',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, MtxSelectModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24FilterSelect<D, T extends F24FilterSourceSelectType> implements OnInit, OnDestroy {
  /**
   * params
   */
  readonly params = input<F24FilterSourceSelectParams<D,T>>();
  /**
   * source 
   */
  protected readonly source = input(createFilterSourceSelect(this.params()));
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
