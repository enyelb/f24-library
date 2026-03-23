import { AnimationCallbackEvent, Component, contentChildren, effect, input, untracked } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { F24Note } from '@f24/alerts';
import { F24_FORM_TOKEN, FormCheckbox, FormFile, FormPhone, FormRadio } from '@f24/forms';

import { createPreviewFormSource, createPreviewFormSourceParams, F24PreviewFormSourceParams } from './preview-form-source';

/**
 * F24PreviewForm
 */
@Component({
  selector: 'f24-preview-form',
  imports: [
    MatButtonModule, MatIconModule,
    F24Note
  ],
  templateUrl: './preview-form.html',
  styleUrl: './preview-form.scss',
})
export class F24PreviewForm {
  /**
   * source 
   */
  readonly params = input(createPreviewFormSourceParams());
  readonly source = input(createPreviewFormSource());
  /**
   * inputs
   */
  readonly title = input<F24PreviewFormSourceParams['title']>();
  readonly description = input<F24PreviewFormSourceParams['description']>();
  readonly icon = input<F24PreviewFormSourceParams['icon']>();
  readonly type = input<F24PreviewFormSourceParams['type']>();
  readonly linked = input<F24PreviewFormSourceParams['linked']>();
  readonly form = input<F24PreviewFormSourceParams['form']>();
  readonly auto = input<F24PreviewFormSourceParams['auto']>();
  readonly hidden = input<F24PreviewFormSourceParams['hidden']>();
  readonly clear = input<F24PreviewFormSourceParams['clear']>();
  readonly clearAll = input<F24PreviewFormSourceParams['clearAll']>();
  readonly labelNext = input<F24PreviewFormSourceParams['labelNext']>();
  readonly labelClear = input<F24PreviewFormSourceParams['labelClear']>();
  readonly checked = input<F24PreviewFormSourceParams['checked']>();
  readonly animation = input<F24PreviewFormSourceParams['animation']>();
  /**
   * los formularios a previzualizar
   */
  protected readonly contentForms = contentChildren(F24_FORM_TOKEN, { descendants: true });
  /**
   * constructor
   */
  constructor() {
    /**
     * efecto para asignar params
     */
    effect(() => {
      this.source()?.update({
        title: this.title(),
        description: this.description(),
        icon: this.icon(),
        type: this.type(),
        linked: this.linked(),
        form: this.form(),
        auto: this.auto(),
        hidden: this.hidden(),
        clear: this.clear(),
        clearAll: this.clearAll(),
        labelNext: this.labelNext(),
        labelClear: this.labelClear(),
        checked: this.checked(),
        animation: this.animation()
      }, this.params());
    });

    /**
     * efecto para asignar contentForms
     */
    effect(() => {
      const content = this.contentForms();
      const forms = content.map((form) => {
        if (form instanceof FormCheckbox || form instanceof FormRadio || form instanceof FormFile || form instanceof FormPhone) {
          return form.control();
        } else {
          return form.source().form();
        }
      })
      const onlyRadioOrCheckbox = !content.some((form) => !(form instanceof FormCheckbox || form instanceof FormRadio));
      this.source().update({
        form: forms,
        auto: onlyRadioOrCheckbox
      });
    })
  }
  /**
   * onEnterAnimationDone
   */
  protected onEnterAnimationDone(event: AnimationCallbackEvent) {
    this.source().update({ animation: true });
    event.animationComplete();
  }
  /**
   * onLeaveAnimationDone
   */
  protected onLeaveAnimationDone(event: AnimationCallbackEvent) {
    this.source().update({ animation: false });
    event.animationComplete();
  }
  /**
   * updateChecked
   */
  protected updateChecked(checked: boolean) {
    this.source().update({ checked });
  }
}