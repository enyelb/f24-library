import { Injectable } from '@angular/core';

import { SwalService } from './swal/swal-service';
import { SnackService } from './snack/snack-service';
import { ToastService } from './toast/toast-service';
import { DialogService } from './dialog/dialog-service';

/**
 * NotificationService
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {


  /**
   * constructor
   */
  constructor(public toast: ToastService, public swal: SwalService, public snack: SnackService, public dialog: DialogService) {
  }
}
