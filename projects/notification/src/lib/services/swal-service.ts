import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { SweetAlertOptions } from 'sweetalert2';

/**
 * SwalService
 */
@Injectable({
  providedIn: 'root'
})
export class SwalService {

  /**
   * swal
   */
  swal: any;

  /**
   * loadSweetalert2
   */
  async loadSweetalert2() {
    if (!this.swal) {
      const swalModule = await import('sweetalert2/dist/sweetalert2.js');
      this.swal = swalModule.default;
    }

    if (this.swal) {
      return true;
    }
    return false;
  }

  /**
   * swalBase
   */
  private swalBase(title: string, text: string, icon: 'warning' | 'error' | 'success' | 'info' | 'question' | undefined, options: CustomSweetAlertOptions) {

    options.title = title;
    options.icon = icon;

    if (options.enableHtml) {
      options.html = text;
    } else {
      options.text = text;
    }

    if (!options.denyButtonColor) {
      options.denyButtonColor = '#ff0f27'
    }
    if (!options.confirmButtonColor) {
      options.confirmButtonColor = icon === 'question' ? '#11c346' : '#2794ff';
    }
    if (!options.cancelButtonColor) {
      options.cancelButtonColor = '#ff0f27'
    }
    this.loadSweetalert2().then(load => {

      if (!load) return false;

      const fireOptions = {
        ...options
      }

      delete fireOptions['empty'];
      delete fireOptions['deny'];
      delete fireOptions['confirm'];

      this.swal.fire(fireOptions).then((result: any ) => {

        if(options.deny && ( result.isDenied || result.isDismissed)) {
          options.deny();
          return;
        }

        if (options.empty && !result.value) {
          options.empty();
          return;
        }

        if(options.confirm && result.isConfirmed) {
          options.confirm(result.value);
        }
      });

      return true
    });

  }

  /**
   * createBaseConfig
   */
  private createOptions(icon: string, options?: CustomSweetAlertOptions): CustomSweetAlertOptions  {
    const optionsbase: CustomSweetAlertOptions = options ? options : {};

    if(icon === 'question' || icon === 'warning') {
      optionsbase.showConfirmButton = true;
      optionsbase.showDenyButton = true;
      optionsbase.confirmButtonText = 'Si';
      optionsbase.denyButtonText = 'No';
    }

    if (optionsbase.preConfirm) {
      optionsbase.showLoaderOnConfirm = true;
      optionsbase.showConfirmButton = true;
    }

    if (optionsbase.preDeny) {
      optionsbase.showLoaderOnDeny = true;
      optionsbase.showDenyButton = true;
    }

    if (!optionsbase.showConfirmButton) {
      optionsbase.showConfirmButton = true;
    }
    if (!optionsbase.showCancelButton) {
      optionsbase.showCancelButton = false;
    }

    return optionsbase;
  }

  /**
   * success
   */
  success(title: string, text: string, config?: CustomSweetAlertOptions) {
    const options = this.createOptions('success', config);
    this.swalBase(title, text, 'success', options)
  }

  /**
   * fire
   */
  error(title: string, text: string, config?: CustomSweetAlertOptions) {
    const options = this.createOptions('error', config);
    this.swalBase(title, text, 'error', options)
  }

  /**
   * warning
   */
  warning(title: string, text: string, config?: CustomSweetAlertOptions) {
    const options = this.createOptions('warning', config);
    this.swalBase(title, text, 'warning', options)
  }

  /**
   * info
   */
  info(title: string, text: string, config?: CustomSweetAlertOptions) {
    const options = this.createOptions('info', config);
    this.swalBase(title, text, 'info', options)
  }

  /**
   * question
   */
  question(title: string, text: string, config?: CustomSweetAlertOptions) {
    const options = this.createOptions('question', config);
    this.swalBase(title, text, 'question', options)
  }

  /**
   * confirm
   */
  public confirm(question: string, config: CustomSweetAlertOptions = {}, notification: boolean = true) : Observable<boolean> {
    const stream = new Subject<boolean>();
    if (notification) {
      this.question(question, '', {
        ... config,
        preConfirm: () => stream.next(true),
        preDeny: () => stream.error(false),
        didClose: () => stream.error(false)
      });
    } else {
      stream.next(true)
    }
    return stream.asObservable();
  }
}

/**
 * CustomSweetAlertOptions
 */
export type CustomSweetAlertOptions = SweetAlertOptions & {
  confirm?: (value?:any) => void
  deny?: () => void,
  empty?: () => void,
  enableHtml?: boolean,
}
