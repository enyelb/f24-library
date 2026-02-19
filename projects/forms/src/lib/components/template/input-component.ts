import { Component } from "@angular/core";

import { F24FormInputSource, F24FormInputSourceParams } from '../source/input-source';
import { F24FormComponent } from "./form-component";

/**
 * F24InputComponent
 */
@Component({
  template: ''
})
export abstract class F24InputComponent<
  T, 
  Source extends F24FormInputSource<T> = F24FormInputSource<T>,
  Params extends F24FormInputSourceParams<T> = F24FormInputSourceParams<T>,
> extends F24FormComponent<T, Source, Params> {}
