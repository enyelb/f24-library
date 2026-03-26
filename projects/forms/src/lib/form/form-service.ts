import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { SnackService, SwalService } from '@f24/notification';

import { F24Form, F24FormControlType, F24FormGroupType, F24FormModelPlainType, F24FormModelType } from './form';
import { Observable } from 'rxjs';

/**
 * Forms
 */
@Injectable({
  providedIn: 'root',
})
export abstract class F24FormService {
  /**
   * route
   */
  protected readonly router = inject(Router);

  /**
   * notification
   */
  private readonly notifcation = {
    swal: inject(SwalService),
    snack: inject(SnackService)
  }
  /**
   * isErrorApi
   */
  protected isErrorApi = signal(false);
  /**
   * implements
   */
  abstract get controls(): F24FormControlType<any>;
  abstract get group(): F24FormGroupType<any>;
  abstract get model(): F24FormModelType<any>;
  abstract get value(): F24FormModelPlainType<any>;
  abstract get forms(): F24Form<any>;
  abstract request(model: F24FormModelPlainType<any>): Observable<any>;
  /**
   * is error
   */
  get isError() {
    return this.isErrorApi.asReadonly();
  }
  /**
   * markAsTouched
   */
  public markAsTouched() {
    this.forms.markAsTouched();
  }
  /**
   * markAsUntouched
   */
  public markAsUntouched() {
    this.forms.markAsUntouched();
  }
  /**
   * reset
   */
  public reset() {
    this.forms.reset();
  }
  /**
   * valid
   */
  public valid(): boolean {
    return this.forms.valid;
  }
  /**
   * invalid
   */
  public invalid(): boolean {
    return this.forms.invalid;
  }
  /**
   * complete
   */
  protected complete(route?: string) {
    this.reset();
    if (route) {
      this.router.navigate([route]);
    }
  }

  /**
   * onSubmit
   */
  onSubmit(config: { 
    route?: string,
    labels?: {
      sussess?: string
      error?: string
    }
  }): void {
    
    if (this.forms.invalid) {
      return;
    }

    this.request(this.value).subscribe({
      next: (value) => {
        this.notifcation.swal.success(config.labels?.sussess ?? 'Operación realizada con éxito', ``, {
          confirm: () => this.complete(config.route)
        });
        this.isErrorApi.set(false);
      },
      error: (error) => {
        let message = ``;
        if (error.error.errors) {
          for (const [key, value] of Object.entries(error.error.errors)) {
            message += `\n${key}: ${value}`;
          }
        } else if (error.error.error) {
          message += `\n${error.error.error}`;
        } else {
          message = config.labels?.error ?? 'Error al realizar la operación';
        }

        this.isErrorApi.set(true);

        this.notifcation.snack.error(message, 'cerrar', {
          duration: 5000
        });
      }
    });
  }

  /**
   * onSubmitConfirm
   */
  onSubmitConfirm(config: {
    route?: string
    labels?: {
      sussess?: string
      error?: string
      confirm?: string
    },
    icon?: 'warning' | 'error' | 'success' | 'info' | 'question',
    html?: string
  }): void {
    this.notifcation.swal.confirm(config.labels?.confirm ?? '¿Estas seguro?', {
      confirmButtonText: 'Si',
      icon: config.icon,
      html: config.html,
      confirm: () => {
        this.onSubmit(config);
      }
    })
  }
}