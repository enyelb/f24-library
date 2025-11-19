import { Component, inject, viewChild, effect, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldControl } from '@angular/material/form-field';

import { FormFieldControl } from '../form-field-control';
import { countries, Phone, Validators } from '../validators';

/**
 * InputPhone
 */
@Component({
  selector: 'f24-input-phone',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './input-phone.html',
  styleUrl: './input-phone.scss',
  providers: [{provide: MatFormFieldControl, useExisting: InputPhone}],
  host: {
    '[class.floating]': 'shouldLabelFloat',
    '[class.empty]': 'empty',
    '[id]': 'id',
  },
})
export class InputPhone extends FormFieldControl<Phone> {
  /**
   * view chaild
   */
  readonly areaInput = viewChild.required<HTMLInputElement>('area');
  readonly exchangeInput = viewChild.required<HTMLInputElement>('exchange');
  readonly subscriberInput = viewChild.required<HTMLInputElement>('subscriber');

  /**
   * forms
   */
  readonly parts: FormGroup<{
    area: FormControl<string | null>;
    exchange: FormControl<string | null>;
    subscriber: FormControl<string | null>;
  }>;

  /**
   * name
   */
  protected override name: string = 'f24-input-phone';

  /**
   * matchers
   */
  private matchers = signal(countries['ve']);

  /**
   * constructor
   */
  constructor() {
    super();

    this.parts = inject(FormBuilder).group({
      area: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      exchange: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      subscriber: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
    });

    effect(() => {
      const { area, exchange, subscriber } = this.matchers();

      const areaValidators = Phone.validators(area);
      const exchangeValidators = Phone.validators(exchange);
      const subscriberValidators = Phone.validators(subscriber);

      if (areaValidators) {
        this.parts.controls.area.setValidators(areaValidators)
      }
      if (exchangeValidators) {
        this.parts.controls.exchange.setValidators(exchangeValidators)
      }
      if (subscriberValidators) {
        this.parts.controls.subscriber.setValidators(subscriberValidators)
      }
    })

    effect(() => {
      if (!this.control.hasValidator(Validators.phone)) {
        this.control.addValidators(Validators.phone);
      }
    })

    effect(() => {
      this.disabled ?
        this.parts.disable():
        this.parts.enable();
    })
  }

  /**
   * onContainerClick
   */
  onContainerClick(event: MouseEvent): void {
    if (this.parts.controls.subscriber.valid) {
      this.focusMonitor.focusVia(this.subscriberInput(), 'program');
    } else if (this.parts.controls.exchange.valid) {
      this.focusMonitor.focusVia(this.subscriberInput(), 'program');
    } else if (this.parts.controls.area.valid) {
      this.focusMonitor.focusVia(this.exchangeInput(), 'program');
    } else {
      this.focusMonitor.focusVia(this.areaInput(), 'program');
    }
  }

  /**
   * autoFocusNext
   * @param control
   * @param nextElement
   */
  autoFocusNext(control: AbstractControl, nextElement?: HTMLInputElement): void {
    if (!control.errors && nextElement) {
      this.focusMonitor.focusVia(nextElement, 'program');
    }
  }

  /**
   * autoFocusPrev
   * @param control
   * @param prevElement
   */
  autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
    if (control.value.length < 1) {
      this.focusMonitor.focusVia(prevElement, 'program');
    }
  }

  /**
   * input
   * @param control
   * @param nextElement
   * @returns
   */
  input(control: AbstractControl, nextElement?: HTMLInputElement): void {
    this.autoFocusNext(control, nextElement);

    const { area, exchange, subscriber } = this.parts.value;

    if (!area && !exchange && !subscriber) {
      this.value = null;
      return
    }
    const phone = new Phone(area || '', exchange || '', subscriber || '');

    if (!phone.equal(this.value)) {
      this.value = phone;
      return;
    }
  }
}
