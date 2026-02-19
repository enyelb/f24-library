import { Component, effect, EffectCleanupRegisterFn, input, InputSignal, untracked } from "@angular/core";

import { F24BaseSource, F24BaseSourceParams } from '../source/base-source';

/**
 * F24BaseComponent
 */
@Component({
  template: ''
})
export abstract class F24BaseComponent<Source extends F24BaseSource, Params extends F24BaseSourceParams>  {
  /**
   * abstracts
   */
  abstract readonly params: InputSignal<Params | undefined>;
  abstract readonly source: InputSignal<Source>;
  /**
   * inputs
   */
  readonly id = input<F24BaseSourceParams['id']>();
  readonly label = input<F24BaseSourceParams['label']>();
  readonly appearance = input<F24BaseSourceParams['appearance']>();
  /**
   * constructor
   */
  constructor() {
    /**
     * efecto para asignar params
     */
    effect((onCleanup) => this.update(this.params(), onCleanup));
    /**
     * efecto para asignar id
     */
    effect((onCleanup) => this.update({ id: this.id() }, onCleanup));
    /**
     * efecto para asignar label
     */
    effect((onCleanup) => this.update({ label: this.label() }, onCleanup));
    /**
     * efecto para asignar appearance
     */
    effect((onCleanup) => this.update({ appearance: this.appearance() }, onCleanup));
  }
  /**
   * update
   * @param params 
   * @param onCleanup 
   */
  protected update(params: {}  | undefined, onCleanup: EffectCleanupRegisterFn) {
    const rafId = requestAnimationFrame(() => {
      untracked(() => {
        this.source()?.update(params);
      });
    });
    onCleanup(() => cancelAnimationFrame(rafId));
  }
}
