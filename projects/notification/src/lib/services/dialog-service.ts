import { ComponentType } from '@angular/cdk/portal';
import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

/**
 * DialogService
 */
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  /**
   * constructor
   */
  constructor(private dialog: MatDialog) { } 

  /**
   * messageBase
   */
  private messageBase<D>(DialogComponent: ComponentType<D> | TemplateRef<D>, data: {}, config?: MatDialogConfig<any>) : MatDialogRef<D, any> {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: data,
      ... config
    });

    return dialogRef;
  }

  /**
   * open
   */
  open<D>(DialogComponent: ComponentType<D> | TemplateRef<D>, data: {}, config?: MatDialogConfig<any>) : Observable<any>  {
    return this.messageBase(DialogComponent, data, config).afterClosed();
  }

  /**
   * open
   */
  openRef<D>(DialogComponent: ComponentType<D> | TemplateRef<D>, data: {}, config?: MatDialogConfig<any>) : MatDialogRef<D, any> {
    return this.messageBase(DialogComponent, data, config);
  }
}