import { AnimationCallbackEvent, Component, computed, effect, input, signal, untracked } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { combineLatest, map, of, startWith, switchMap } from 'rxjs';

/**
 * F24PreviewForm
 */
@Component({
  selector: 'f24-preview-form',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './preview-form.html',
  styleUrl: './preview-form.scss',
})
export class F24PreviewForm {
  /**
   * title
   */
  readonly title = input('');
  /**
   * linked
   */
  readonly linked = input<F24PreviewForm>();
  /**
   * form
   */
  readonly form = input<AbstractControl | AbstractControl[]>();
  /**
   * auto
   */
  readonly auto = input(true);
  /**
   * hidden
   */
  readonly hidden = input(false);
  /**
   * clear
   */
  readonly clear = input(true);
  /**
   * clearAll
   */
  readonly clearAll = input(true);
  /**
   * labelNext
   */
  readonly labelNext = input('Aceptar');
  /**
   * labelClear
   */
  readonly labelClear = input('Limpiar todo');
  /**
   * forms
   */
  protected readonly forms = computed(() => {
    const form = this.form();
    return form ? Array.isArray(form) ? form : [form] : [];
  })
  /**
   * isValid
   */
  readonly isValid = toSignal(
    toObservable(this.forms).pipe(
      switchMap(forms => {
        if (forms.length === 0) {
          return of(true);
        }
        const valueChanges$ = forms.map(f =>
          f.valueChanges.pipe(startWith(f.value))
        );
        return combineLatest(valueChanges$).pipe(
          map(() => !forms.some(f => f.invalid))
        );
      })
    ),
    { initialValue: false }
  );
  /**
   * signals
   */
  protected readonly _checked = signal(false);
  protected readonly _visible = signal(true);
  protected readonly _animation = signal(false);
  protected readonly _index = signal(0);
  /**
   * components
   */
  protected readonly _components: F24PreviewForm[] = [];
  /**
   * constructor
   */
  constructor() {
    /**
     * efecto para asociar checked input al signal
     */
    effect(() => {
      const index = this.push(this);
      this._index.set(index);
    });
    /**
     * efecto para validar si el formulario cambio
     */
    effect(() => {
      const auto = this.auto();
      const isValid = this.isValid();
      /**
       * ver si todos los campos son validos
       */
      if (!auto) {
        return;
      }
      untracked(() => {
        if (isValid != this._checked()) {
          this._checked.set(isValid);
        }
      });
    });
    /**
     * efecto para saber si es visible
     */
    effect(() => {
      const linked = this.linked();
      if (!linked) {
        return;
      }
      const visible = linked._visible();
      const checked = linked._checked();
      const animation = linked._animation();
      const hidden = linked.hidden();

      this._visible.set((visible && checked && !animation) || (visible && hidden));
    });
  }
  /**
   * isChecked
   */
  get isChecked() {
    return this._checked.asReadonly();
  }
  /**
   * onEnterAnimationDone
   */
  protected onEnterAnimationDone(event: AnimationCallbackEvent) {
    this._animation.set(true);
    event.animationComplete();
  }
  /**
   * onLeaveAnimationDone
   */
  protected onLeaveAnimationDone(event: AnimationCallbackEvent) {
    this._animation.set(false);
    event.animationComplete();
  }
  /**
   * unchecked 
   */
  protected unchecked() {
    this._checked.set(false);
    if (this.clear() && this.auto()) {
      this.forms().forEach(form => form.reset());
    }
    if (this.clearAll()) {
      this.data()
        .filter(form => form._index() > this._index())
        .forEach(form => form.unchecked());
    }
  }
  /**
   * next
   */
  protected next() {
    if (this.isValid()) {
      this._checked.set(true);
    }
  }
  /**
   * push
   * @param form
   */
  protected push(form: F24PreviewForm): number {
    const linked = this.linked();
    if (linked) {
      return linked.push(form); 
    };
    this._components.push(form);
    return this._components.length - 1;
  }
  /**
   * data
   * @returns Data[]
   */
  protected data(): F24PreviewForm[] {
    const linked = this.linked();
    if (linked) {
      return linked.data(); 
    };
    return this._components;
  }
}
