import { inject, Injectable } from '@angular/core';
import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

import { Validators, Phone } from '../validators';

/**
 * Form
 */
export class Form<T> {
  /**
   * properties
   */
  private _value: T | null
  private _disabled: boolean = false
  private readonly _Validators: ValidatorFn[] = [];
  private readonly _asyncValidator: AsyncValidatorFn[] = [];
  /**
   * constructor
   * @param value
   */
  constructor(value?: T) {
    this._value = value || null;
  }
  /**
   * disabled
   * @returns
   */
  disabled() {
    this._disabled = true;
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
  /**
   * form
   */
  form(): FormControl<T | null>{
    return new FormControl<T | null>({
      value: this._value,
      disabled: this._disabled
    }, this._Validators, this._asyncValidator);
  }

}

/**
 *
 */
@Injectable({
  providedIn: 'root',
})
export class Builder {

  /**
   * builder
   */
  private readonly builder = inject(FormBuilder);


  /**
   * create
   */
  public create<T extends { [K in keyof T]: AbstractControl<any, any, any>; }>(group: T) {
    return this.builder.group(group)
  }

  /**
   * create
   */
  public createFn<T extends { [K in keyof T]: AbstractControl<any, any, any>; }>(
    fn: (builder: Builder) => {[K in keyof T]: Form<any> | AbstractControl<any, any, any>; }
  ) {

    const group = fn(this);
    const newGroup: { [K in keyof T]: AbstractControl<any, any, any> } = {} as T;

    for (const key in group) {
      if (group.hasOwnProperty(key) && group[key] instanceof Form) {
        newGroup[key] = group[key].form();
      } else if (group.hasOwnProperty(key) && group[key] instanceof AbstractControl){
        newGroup[key] = group[key];
      }
    }

    return this.builder.group(newGroup)
  }

  public group<T extends {}>(controls: T, options?: AbstractControlOptions | null) {
    return this.builder.group(controls, options);
  }

  /**
   * form
   */
  public form<T>(value?: T) {
    return new Form<T>(value);
  }

  /**
   * number
   */
  public number(value?: number) {
    return this.form<number>(value);
  }

  /**
   * string
   */
  public string(value?: string) {
    return this.form<string>(value);
  }

  /**
   * boolean
   */
  public boolean(value?: boolean) {
    return this.form<boolean>(value);
  }
  
  /**
   * array
   */
  public array<T = string>(value?: Array<T>) {
    return this.form<Array<T>>(value);
  }

  /**
   * date
   */
  public date(value?: Date | string) {
    return this.form<Date | string>(value);
  }

  /**
   * file
   */
  public file(value?: File) {
    return this.form<File>(value);
  }

  /**
   * phone
   */
  public phone(phone?: Phone) {
    return this.form<Phone>(phone).phone();
  }
}
