import { Component, effect, input } from "@angular/core";

import { F24FormSelectSource, F24FormSelectSourceParams } from '../source/select-source';
import { F24FormComponent } from "./form-component";

/**
 * F24FormComponent
 */
@Component({
  template: ''
})
export abstract class F24SelectComponent<
  I, T, 
  Source extends F24FormSelectSource<I, T> = F24FormSelectSource<I, T>,
  Params extends F24FormSelectSourceParams<I, T> = F24FormSelectSourceParams<I, T>,
> extends F24FormComponent<T, Source, Params> {
  /**
   * inputs
   */
  readonly multiple = input<F24FormSelectSourceParams<I, T>['multiple']>();
  readonly items = input<F24FormSelectSourceParams<I, T>['items']>();
  readonly formatter = input<F24FormSelectSourceParams<I, T>['formatter']>();
  readonly bind = input<F24FormSelectSourceParams<I, T>['bind']>();
  /**
   * constructor
   */
  constructor() {
    super();
    /**
     * efecto para asignar params
     */
    effect((onCleanup) => this.update(this.params(), onCleanup));
    /**
     * efecto para asignar multiple
     */
    effect((onCleanup) => this.update({ multiple: this.multiple() }, onCleanup));
    /**
     * efecto para asignar items
     */ 
    effect((onCleanup) => this.update({ items: this.items() }, onCleanup));
    /**
     * efecto para asignar formatter
     */ 
    effect((onCleanup) => this.update({ formatter: this.formatter() }, onCleanup));
    /**
     * efecto para asignar bind
     */ 
    effect((onCleanup) => this.update({ bind: this.bind() }, onCleanup));
  }
}
