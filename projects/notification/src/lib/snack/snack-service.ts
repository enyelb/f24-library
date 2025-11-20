import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * SnackService
 */
@Injectable({
  providedIn: 'root'
})
export class SnackService {

  /**
   * constructor
   */
  constructor(private snackbar: MatSnackBar) {
  } 

  /**
   * messageBase
   */
  private messageBase(message: string, action: string, config: MessageConfig) {
    if (this.snackbar) {
      this.snackbar.open(message, action, {
        duration:  config.duration ? config.duration : 2000,
        horizontalPosition: config.horizontalPosition ? config.horizontalPosition : 'center',
        verticalPosition: config.verticalPosition ? config.verticalPosition : 'top',
        panelClass: config.panelClass ? config.panelClass : []
      });
    }
  }

  /**
   * createBaseConfig
   */
  private createBaseConfig(config?: MessageConfig, panelClass: string = "") {
    const configbase: MessageConfig = config ? config : {};
    if (configbase.panelClass) {
      configbase.panelClass.push(panelClass);
    } else {
      configbase.panelClass = [panelClass];
    }
    return configbase;
  }

  /**
   * message
   */
  message(message: string, action: string, config?: MessageConfig) {
    const configbase = this.createBaseConfig(config, "message-snackbar");
    this.messageBase(message, action, configbase)
  }

  /**
   * error
   */
  error(message: string, action: string, config?: MessageConfig) {
    const configbase = this.createBaseConfig(config, "error-snackbar");
    this.messageBase(message, action, configbase);
  }
}

/**
 * MessageConfig
 */
export interface MessageConfig {
  duration?: number,
  horizontalPosition?: 'start' | 'center' | 'end' | 'left' | 'right',
  verticalPosition?: 'top' | 'bottom',
  panelClass?: string[] 
}