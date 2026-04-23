import { Component, inject, input, TemplateRef, viewChild } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { DialogService } from '../../services/dialog-service';

/**
 * F24Dialog
 */
@Component({
  selector: 'f24-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class F24Dialog<Data> {
  /**
   * services
   */
  readonly dialog = inject(DialogService);
  protected dialogRef: MatDialogRef<any> | undefined;
  protected data: Data | undefined;
  /**
   * inpuets
   */
  readonly title = input<string>();
  readonly accept = input<string>();
  readonly cancel = input<string>();
  readonly onAccept = input<() => void>();
  readonly onCancel = input<() => void>();
  /**
   * views
   */
  readonly template = viewChild.required('template', { read: TemplateRef });
  /**
   * open
   */
  public open(data?: Data) {
    this.data = data;
    this.dialogRef = this.dialog.openRef(this.template(), data ?? {}, { width: '100%', maxWidth: '90vw' });
    return this.dialogRef;
  }
  /**
   * confirm
   */
  public confirm(data?: Data) {
    return this.open(data).afterClosed();
  }
  /**
   * close
   */
  public close() {
    if (!this.dialogRef) {
      return;
    }
    this.dialogRef.close();
  }
}
