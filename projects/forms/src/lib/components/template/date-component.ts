import { Component } from "@angular/core";

import { F24FormDateSource, F24FormDateSourceParams } from '../source/date-source';
import { F24FormComponent } from "./form-component";

/**
 * F24DateComponent
 */
@Component({
  template: ''
})
export abstract class F24DateComponent<
  Source extends F24FormDateSource = F24FormDateSource,
  Params extends F24FormDateSourceParams = F24FormDateSourceParams,
> extends F24FormComponent<Date | string, Source, Params> {}
