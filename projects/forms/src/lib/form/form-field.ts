import { effect, signal, WritableSignal } from "@angular/core";
import { AsyncValidatorFn, FormControl, ValidatorFn } from "@angular/forms";
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { distinctUntilChanged, startWith } from "rxjs";

import { Validators } from "../validators";

/**
 * F24FormField
 */
export class F24FormField<C> {
  /**
   * value
   */
  private readonly _value: WritableSignal<C | null>;
  /**
   * disabled
   */
  private readonly _disabled: WritableSignal<boolean>;
  /**
   * validations
   */
  private readonly _Validators: ValidatorFn[] = [];
  private readonly _asyncValidator: AsyncValidatorFn[] = [];
  /**
   * form
   */
  private _form: FormControl<C | null> | null = null;

  /**
   * constructor
   *
   * @param config
   */
  constructor(value?: C | null) {
    this._value = signal(value || null);
    this._disabled = signal(false);
  }
  /**
   * value
   */
  get value() {
    return this._value.asReadonly();
  }
  /**
   * form
   */
  get form() {
    if (!this._form) {
      this._form = new FormControl<C | null>({
        value: this._value(),
        disabled: this._disabled()
      }, this._Validators, this._asyncValidator);

      const value = toSignal(
        this._form.valueChanges.pipe(
          startWith(this._form.value),
          distinctUntilChanged(),
          takeUntilDestroyed()
        ),
        { initialValue: null }
      );
      /**
       * efecto para cambiar el valor del signal
       */
      effect(() => {
        this._value.set(value());
      });
    }
    return this._form;
  }

  /**
   * disabled
   * @returns
   */
  disabled() {
    this._disabled.set(true);
    return this;
  }
  /**
   * required
   * @returns
   */
  required() {
    this._Validators.push(Validators.required);
    return this;
  }
  /**
   * min
   * @param min
   * @returns
   */
  min(min: number) {
    this._Validators.push(Validators.min(min));
    return this;
  }
  /**
   * max
   * @param max
   * @returns
   */
  max(max: number): this {
    this._Validators.push(Validators.max(max));
    return this;
  }
  /**
   * requiredTrue
   * @returns
   */
  requiredTrue(): this {
    this._Validators.push(Validators.requiredTrue);
    return this;
  }
  /**
   * email
   * @returns
   */
  email(): this {
    this._Validators.push(Validators.email);
    return this;
  }
  /**
   * minLength
   * @param minLength
   * @returns
   */
  minLength(minLength: number): this {
    this._Validators.push(Validators.minLength(minLength));
    return this;
  }
  /**
   * maxLength
   * @param maxLength
   * @returns
   */
  maxLength(maxLength: number): this {
    this._Validators.push(Validators.maxLength(maxLength));
    return this;
  }
  /**
   * pattern
   * @param pattern
   * @returns
   */
  pattern(pattern: string | RegExp): this {
    this._Validators.push(Validators.pattern(pattern));
    return this;
  }
  /**
   * nullValidator
   * @returns
   */
  nullValidator(): this {
    this._Validators.push(Validators.nullValidator);
    return this;
  }
  /**
   * phone
   * @param asyncValidator
   * @returns
   */
  phone(): this {
    this._Validators.push(Validators.phone);
    return this;
  }
}

/**
 * number
 */
export function number(value?: number) {
  return new F24FormField<number>(value);
}
/**
 * string
 */
export function string(value?: string) {
  return new F24FormField<string>(value);
}
/**
 * boolean
 */
export function boolean(value?: boolean) {
  return new F24FormField<boolean>(value);
}

/**
 * array
 */
export function array<T = string>(value?: Array<T>) {
  return new F24FormField<Array<T>>(value);
}
/**
 * date
 */
export function date(value?: Date | string) {
  return new F24FormField<Date | string>(value);
}
/**
 * file
 */
export function file(value?: File) {
  return new F24FormField<File>(value);
}