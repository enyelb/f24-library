import { Component, Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';


/**
 * ToastService
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {

  /**
   * pending
   */
  pending: boolean = false;

  /**
   * toasts
   */
  toasts: Toast[] = [];

  /**
   * constructor
   */
  constructor(public toastr: ToastrService) {
  }

  /**
   * createBaseConfig
   */
  private createBaseConfigToast(config?: MessageConfigToast) {
    const configbase: MessageConfigToast = config ? config : {};

    if (!configbase.progressBar) {
      configbase.progressBar = true;
    }

    return configbase;
  }

  /**
   * success
   */
  private toast(type: 'success' | 'error' | 'warning' | 'info', title: string, text: string, config?: MessageConfigToast) {
    this.toasts.push({
      type: type,
      title: title,
      text: text,
      config: this.createBaseConfigToast(config)
    });

    if (!this.pending) {
      const toast = this.toasts.pop();
      if (toast) {
        this.run(toast, 0);
      }
    }
  }

  /**
   * run
   */
  private run(toast: Toast, ms: number) {
    this.pending = true;

    setTimeout(() => {
      this.show(toast);
      const newtoast = this.toasts.pop();
      if (newtoast) {
        this.run(newtoast, 200)
      } else {
        this.pending = false;
      }
    }, ms);
  }

  /**
   * show
   */
  private show(toast: Toast) {
    const config = toast.config;
    if (toast.type === 'success') {
      this.toastr.success(toast.text, toast.title, config);
    } else if (toast.type === 'error') {
      this.toastr.error(toast.text, toast.title, config);
    } else if (toast.type === 'warning') {
      this.toastr.warning(toast.text, toast.title, config);
    } else {
      this.toastr.info(toast.text, toast.title, config);
    }
  }

  /**
   * success
   */
  success(title: string, text: string, config?: MessageConfigToast) {
    this.toast('success', title, text, config);
  }

  /**
   * error
   */
  error(title: string, text: string, config?: MessageConfigToast) {
    this.toast('error', title, text, config);
  }

  /**
   * warning
   */
  warning(title: string, text: string, config?: MessageConfigToast) {
    this.toast('warning', title, text, config);
  }

  /**
   * info
   */
  info(title: string, text: string, config?: MessageConfigToast) {
    this.toast('info', title, text, config);
  }
}

/**
 * Toast
 */
interface Toast {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string,
  text: string,
  config: {}
}

/**
 * MessageConfigToast
 */
export interface MessageConfigToast {
  toastComponent?: Component,
  closeButton?: boolean,
  timeOut?: number,
  extendedTimeOut?: number,
  disableTimeOut?: boolean | 'timeOut' | 'extendedTimeOut',
  easing?: string,
  easeTime?: string | number,
  enableHtml?: boolean,
  newestOnTop?: boolean,
  progressBar?: boolean,
  progressAnimation?: 'decreasing' | 'increasing',
  toastClass?: string,
  positionClass?: string,
  titleClass?: string,
  messageClass?: string,
  tapToDismiss?: boolean,
  onActivateTick?: boolean,
}
