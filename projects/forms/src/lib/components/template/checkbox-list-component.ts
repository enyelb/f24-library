import { Component } from "@angular/core";

import { F24FormCheckboxListSource, F24FormCheckboxListSourceParams } from '../source/checkbox-list-source';
import { F24SelectComponent } from "./select-component";

/**
 * F24CheckboxListComponent
 */
@Component({
  template: ''
})
export abstract class F24CheckboxListComponent<
  I, T, 
  Source extends F24FormCheckboxListSource<I, T> = F24FormCheckboxListSource<I, T>,
  Params extends F24FormCheckboxListSourceParams<I, T> = F24FormCheckboxListSourceParams<I, T>,
> extends F24SelectComponent<I, T, Source, Params> {
}
