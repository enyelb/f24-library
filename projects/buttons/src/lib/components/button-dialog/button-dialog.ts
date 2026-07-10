import { Component, effect, input, output, TemplateRef, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { F24Icon } from '@f24/layout';
import { F24Dialog, DialogService } from '@f24/notification';

import { createButtonDialogSource, createButtonDialogSourceParams, F24ButtonDialogSourceParams } from './button-dialog-source';

/**
 * F24ButtonDialog
 */
@Component({
  selector: 'f24-button-dialog',
  imports: [MatButtonModule, F24Icon, F24Dialog],
  templateUrl: './button-dialog.html',
  styleUrl: './button-dialog.scss',
})
export class F24ButtonDialog {

  /**
   * source 
   */
  readonly params = input(createButtonDialogSourceParams());
  readonly source = input(createButtonDialogSource());
  /**
   * inputs
   */
  readonly label = input<F24ButtonDialogSourceParams['label']>();
  readonly tooltip = input<F24ButtonDialogSourceParams['tooltip']>();
  readonly icon = input<F24ButtonDialogSourceParams['icon']>();
  readonly color = input<F24ButtonDialogSourceParams['color']>();
  readonly dialogSize = input<F24ButtonDialogSourceParams['dialogSize']>();
  readonly dialogTitle = input<F24ButtonDialogSourceParams['dialogTitle']>();

  /**
   * outputs
   */
  readonly click = output();
  /**
   * dialogTemplate
   */
  readonly dialogTemplate = input<TemplateRef<any>>();

  /**
   * view childs
   */
  readonly dialog = viewChild(F24Dialog);
  /**
   * constructor
   */
  constructor() {
    /**
     * efecto para asignar params
     */
    effect(() => {
      this.source()?.update({
        label: this.label(),
        tooltip: this.tooltip(),
        icon: this.icon(),
        color: this.color(),
        dialogSize: this.dialogSize(),
        dialogTitle: this.dialogTitle()
      }, this.params());
    });
  }
   /**
   * open
   */
  public open(): void {
    const dialog = this.dialog();
    const click = this.click;
    if (!dialog) {
      return;
    }
    click.emit();
    dialog.open();
  }
}
