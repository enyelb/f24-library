import { NgModule } from '@angular/core';

import { F24FilterDateRange } from './components/filter-date-range/filter-date-range';
import { F24FilterInput } from './components/filter-input/filter-input';
import { F24FilterSelect } from './components/filter-select/filter-select';
import { F24FilterWrapper } from './components/filter-wrapper/filter-wrapper';
import { F24FilterDropdawn } from './directives/filter-dropdawn';

/**
 * F24FiltersModule
 */
@NgModule({
  declarations: [],
  imports: [
    F24FilterInput,
    F24FilterSelect,
    F24FilterDateRange,
    F24FilterWrapper,
    F24FilterDropdawn
  ],
  exports: [
    F24FilterInput,
    F24FilterSelect,
    F24FilterDateRange,
    F24FilterWrapper,
    F24FilterDropdawn
  ]
})
export class F24FiltersModule { }
