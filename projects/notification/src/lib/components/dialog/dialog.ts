import { ChangeDetectionStrategy, Component, inject, input, TemplateRef, viewChild, ViewEncapsulation } from '@angular/core';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { F24LayoutService } from '@f24/layout';

import { DialogService } from '../../services/dialog-service';

/**
 * F24Dialog
 */
@Component({
  selector: 'f24-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class F24Dialog<Data> {
  /**
   * services
   */
  protected readonly layout = inject(F24LayoutService);
  protected readonly dialog = inject(DialogService);
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
  readonly size = input<'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'>('xxl');
  /**
   * views
   */
  readonly template = viewChild.required('template', { read: TemplateRef });
  /**
   * open
   */
  public open(data?: Data) {
    this.data = data;
    const maxWidth = this.layout.sizeToWidth(this.size());
    this.dialogRef = this.dialog.openRef(this.template(), data ?? {}, { 
      width: '100%',
      maxWidth: maxWidth, 
    });
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
