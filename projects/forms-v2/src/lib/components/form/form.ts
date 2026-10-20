import { ChangeDetectionStrategy, Component, computed, contentChildren, inject, input, output, signal, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MtxButtonModule } from '@ng-matero/extensions/button';

import { catchError, finalize, Observable, throwError } from 'rxjs';

import { SnackService, SwalService, ToastService } from '@f24/notification';
import { F24Container } from '@f24/layout';

import { F24FormTree } from '../../directives/form-tree';

import { F24FormSource, F24FormSourceParams } from './form-source';

/**
 * F24Form component
 */
@Component({
  selector: 'f24-form',
  imports: [
    NgTemplateOutlet, 
    MatButtonModule, MtxButtonModule,
    F24Container
  ],
  templateUrl: './form.html',
  styleUrl: './form.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class F24Form<T extends {}> {
  /**
   * services
   */
  protected readonly router = inject(Router);
  protected readonly notificationTypes = {
    swal: inject(SwalService, { optional: true }),
    toast: inject(ToastService, { optional: true }),
    snack: inject(SnackService, { optional: true }) 
  } as const;
  /**
   * childrens
   */
  protected readonly formTreeTemplate = contentChildren<F24FormTree<T>>(F24FormTree); 
  /**
   * inputs
   */
  readonly source = input<F24FormSource<T>>();
  readonly title = input<F24FormSourceParams<T>['title']>();
  readonly labelSubmit = input<F24FormSourceParams<T>['labelSubmit']>();
  readonly labelCancel = input<F24FormSourceParams<T>['labelCancel']>();
  readonly defaultErrorMessage = input<F24FormSourceParams<T>['defaultErrorMessage']>();
  readonly defaultSuccessMessage = input<F24FormSourceParams<T>['defaultSuccessMessage']>();
  readonly notification = input<F24FormSourceParams<T>['notification']>();
  readonly navigateError = input<F24FormSourceParams<T>['navigateError']>();
  readonly navigateSuccess = input<F24FormSourceParams<T>['navigateSuccess']>();
  readonly lockNavigate = input<F24FormSourceParams<T>['lockNavigate']>();
  readonly tree = input<F24FormSourceParams<T>['tree']>();
  readonly request = input<F24FormSourceParams<T>['request']>();
  /**
   * outputs
   */
  readonly error = output<any>();
  readonly success = output<any>();
  
  /**
   * signals resolved
   */
  readonly resolvedTitle = computed(() => this.source()?.title() ?? this.title() ?? '');
  readonly resolvedTree = computed(() => this.source()?.tree() ?? this.tree() ?? undefined);
  readonly resolvedRequest = computed(() => this.source()?.request() ?? this.request() ?? undefined);
  readonly resolvedLabelSubmit = computed(() => this.source()?.labelSubmit() ?? this.labelSubmit() ?? '');
  readonly resolvedLabelCancel = computed(() => this.source()?.labelCancel() ?? this.labelCancel() ?? '');
  readonly resolvedNotification = computed(() => this.source()?.notification() ?? this.notification() ?? 'swal');
  readonly resolvedDefaultErrorMessage = computed(() => this.source()?.defaultErrorMessage() ?? this.defaultErrorMessage() ?? 'Internal error server');
  readonly resolvedDefaultSuccessMessage = computed(() => this.source()?.defaultSuccessMessage() ?? this.defaultSuccessMessage() ?? 'Operación realizada con éxito');
  readonly resolvedNavigateError =  computed(() => this.source()?.navigateError() ?? this.navigateError() ?? undefined);
  readonly resolvedNavigateSuccess =  computed(() => this.source()?.navigateSuccess() ?? this.navigateSuccess() ?? undefined);
  readonly resolvedLockNavigate =  computed(() => this.source()?.lockNavigate() ?? this.lockNavigate() ?? false);
  readonly resolvedOnError = computed(() => (response: any) => {
    const onError = this.source()?.onError();
    if (onError) onError(response);
    this.error.emit(response);
  });
  readonly resolvedOnSuccess = computed(() => (response: any) => {
    const onSuccess = this.source()?.onSuccess();
    if (onSuccess) onSuccess(response);
    this.success.emit(response);
  });
  
  /**
   * signals
   */
  readonly requestPending  = signal(false);
  /**
   * Handles the form submission event.
   * @param event The form submission event.
   */
  onSubmit(event: Event) {
    event.preventDefault();

    const tree = this.resolvedTree();
    const request = this.resolvedRequest();
    if (!tree || !request) {
      return;
    }

    const invalid = tree.form().invalid();
    const requestPending = this.requestPending();
    if (invalid || requestPending) {
      return;
    }
    const onSuccess = this.resolvedOnSuccess();
    const onError = this.resolvedOnError();
    const defaultErrorMessage = this.resolvedDefaultErrorMessage();
    const defaultSuccessMessage = this.resolvedDefaultSuccessMessage();
    const navigateError = this.resolvedNavigateError();
    const navigateSuccess = this.resolvedNavigateSuccess();
    const lockNavigate = this.resolvedLockNavigate();

    this.requestPending.set(true);
    request(tree.model()).pipe(
      catchError((response: HttpErrorResponse) => {
        onError(response);
        if (!lockNavigate && navigateError) {
          this.router.navigate([navigateError]);
        }
        this.notify(this.resolvedNotification(), 'error', response.error.message ?? defaultErrorMessage);
        return throwError(() => response);
      }),
      finalize(() => {
        this.requestPending.set(false);
      })
    ).subscribe((response) => {
      onSuccess(response);
      if (!lockNavigate && navigateSuccess) {
        this.router.navigate([navigateSuccess]);
      }
      this.notify(this.resolvedNotification(), 'success', defaultSuccessMessage); 
    });
  }

  /**
   * 
   */
  protected notify(typeService: F24FormSourceParams<T>['notification'], typeNotification: 'error' | 'success', message: string) {
    const notify = this.notificationTypes[typeService ?? 'swal'];

    if (!notify) {
      return;
    }

    if (typeNotification === 'error') {
      notify?.error('', message);
    } else {
      notify?.success('', message);
    }
  }
}
