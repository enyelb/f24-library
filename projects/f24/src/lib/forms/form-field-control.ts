import { FocusMonitor } from '@angular/cdk/a11y';
import { booleanAttribute, Component, DoCheck, effect, ElementRef, inject, input, OnDestroy, OnInit, signal } from "@angular/core";
import { AbstractControl, ControlValueAccessor, FormControl, FormGroupDirective, NgControl, NgForm } from "@angular/forms";
import { _ErrorStateTracker, ErrorStateMatcher } from '@angular/material/core';

import { MAT_FORM_FIELD, MatFormFieldControl } from "@angular/material/form-field";

import { Subject } from "rxjs";

/**
 * FormFieldControl
 */
@Component({
  template: ''
})
export abstract class FormFieldControl<T> implements MatFormFieldControl<T>, ControlValueAccessor, OnInit, OnDestroy, DoCheck {

  /**
   * nextId
   */
  static nextId = 0;

  /**
   * name
   */
  protected abstract name: string;

  /**
   * data
   */
  private readonly data = {
    onTouched: () => {},
    onChange: (_: T | null) => {},
  };

  /**
   * injects
   */
  readonly ngControl = inject(NgControl, {optional: true, self: true});
  protected readonly parentForm = inject(NgForm, {optional: true});
  protected readonly parentFormGroup = inject(FormGroupDirective, {optional: true});
  protected readonly defaultErrorStateMatcher = inject(ErrorStateMatcher);
  protected readonly formField = inject(MAT_FORM_FIELD, { optional: true });
  protected readonly focusMonitor = inject(FocusMonitor);
  protected readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  /**
   * inputs
   */
  readonly inputUserAriaDescribedBy = input<string>('', {alias: 'aria-describedby'});
  readonly inputPlaceholder = input<string>('', {alias: 'placeholder'});
  readonly inputRequired = input<boolean, unknown>(false, { alias: 'required', transform: booleanAttribute });
  readonly inputDisabled = input<boolean, unknown>(false, { alias: 'disabled', transform: booleanAttribute });
  readonly inputValue = input<T | null>(null, {alias: 'value'});
  readonly inputFormControl = input<AbstractControl | null>(null, { alias: 'formControl' });

  /**
   * stateChanges
   */
  readonly stateChanges = new Subject<void>();
  private readonly errorStateTracker: _ErrorStateTracker;


  /**
   * constructor
   */
  constructor() {

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
      this._control.set(this.ngControl.control as FormControl);
    }

    this.errorStateTracker = new _ErrorStateTracker(
      this.defaultErrorStateMatcher,
      this.ngControl,
      this.parentFormGroup,
      this.parentForm,
      this.stateChanges,
    );

    effect(() => this._userAriaDescribedBy.set(this.inputUserAriaDescribedBy()));
    effect(() => this._placeholder.set(this.inputPlaceholder()));
    effect(() => this._required.set(this.inputRequired()));
    effect(() => this._disabled.set(this.inputDisabled()));
    effect(() => this._value.set(this.inputValue()));
    effect(() => {
      const control = this.inputFormControl();
      if (control) {
        this._control.set(control as FormControl)
      }
    });
  }

  /**
   * class
   */
  class(postfix?: string) {
    if (postfix) {
      return `${this._controlType()}-${postfix}`
    }
    return `${this._controlType()}`
  }
  /**
   * control
   */
  private _control = signal<FormControl>(new FormControl(''));
  get control(): FormControl {
    return this._control();
  }

  /**
   * value
   */
  private _value = signal<T | null>(null);
  get value(): T | null {
    return this._value();
  }
  set value(value: T | null) {
    if (value !== this._value()) {
      this._value.set(value);
      this.data.onChange(value);
      this.stateChanges.next();
    }
  }
  /**
   * id
   */
  private _id = signal('');
  get id(): string {
    return this._id();
  }
  set id(value: string) {
    this._id.set(value);
  }
  /**
   * placeholder
   */
  private _placeholder = signal('');
  get placeholder(): string {
    return this._placeholder();
  }
  set placeholder(value: string) {
    this._placeholder.set(value);
  }
  /**
   * focused
   */
  private _focused = signal(false);
  get focused(): boolean {
    return this._focused();
  }
  set focused(value: boolean) {
    if (value !== this._focused()) {
      this._focused.set(value);
      this.stateChanges.next();
    }
  }
  /**
   * empty
   */
  get empty() {
    return !this._value();
  }
  /**
   * required
   */
  private _required = signal(false);
  get required(): boolean {
    return this._required();
  }
  set required(value: boolean) {
    this._required.set(value);
  }
  /**
   * disabled
   */
  private _disabled = signal(false);
  get disabled(): boolean {
    return this._disabled();
  }
  set disabled(value: boolean) {
    this._disabled.set(value);
  }
  /**
   * touched
   */
  private _touched = signal(false);
  get touched(): boolean {
    return this._touched();
  }
  set touched(value: boolean) {
    if (value !== this._touched()) {
      this._touched.set(value)
      if (value) {
        this.data.onTouched()
      }
      this.stateChanges.next();
    }
  }
  /**
   * errorState
   */
  get errorState() {
    return this.errorStateTracker.errorState;
  }
  set errorState(value: boolean) {
    this.errorStateTracker.errorState = value;
  }
  /**
   * shouldLabelFloat
   */
  private _shouldLabelFloat = signal(false);
  get shouldLabelFloat() {
    return this.focused || !this.empty || this._shouldLabelFloat();
  }
  set shouldLabelFloat(value: boolean) {
    this._shouldLabelFloat.set(value);
  }
  /**
   * userAriaDescribedBy
   */
  private _userAriaDescribedBy = signal('');
  get userAriaDescribedBy() {
    return this._userAriaDescribedBy();
  }
  set userAriaDescribedBy(value: string) {
    this._userAriaDescribedBy.set(value);
  }
  /**
   * controlType
   */
  private _controlType = signal('');
  get controlType() {
    return this._controlType();
  }
  set controlType(value: string) {
    this._controlType.set(value);
  }
  /**
   * autofilled
   */
  private _autofilled = signal(false);
  get autofilled() {
    return this._autofilled();
  }
  set autofilled(value: boolean) {
    this._autofilled.set(value);
  }
  /**
   * disableAutomaticLabeling
   */
  private _disableAutomaticLabeling = signal(false);
  get disableAutomaticLabeling() {
    return this._disableAutomaticLabeling();
  }
  set disableAutomaticLabeling(value: boolean) {
    this._disableAutomaticLabeling.set(value);
  }
  /**
   * describedByIds
   */
  private _describedByIds = signal<string[]>([]);
  get describedByIds() {
    return this._describedByIds();
  }
  set describedByIds(value: string[]) {
    this._describedByIds.set(value);
  }
  /**
   * writeValue
   * @param value
   */
  writeValue(value: T | null): void {
    console.log(value);
    this._value.set(value);
  }

  /**
   * registerOnChange
   * @param fn
   */
  registerOnChange(fn: any): void {
    this.data.onChange = fn;
  }

  /**
   * registerOnTouched
   * @param fn
   */
  registerOnTouched(fn: any): void {
    this.data.onTouched = fn;
  }

  /**
   * setDisabledState
   * @param isDisabled
   */
  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  /**
   * setDescribedByIds
   * @param ids
   */
  setDescribedByIds(ids: string[]) {
    const controlElement = this.elementRef.nativeElement.querySelector(
      `.${this.class('container')}`
    );
    if (!controlElement) {
      return;
    }
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  /**
   * onFocusIn
   */
  protected onFocusIn() {
    this.focused = true;
  }

  /**
   * onFocusOut
   * @param event
   */
  protected onFocusOut(event: FocusEvent) {
    if (!this.elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.focused = false;
      this.touched = true;
    }
  }

  /**
   * ngOnInit
   */
  ngOnInit(): void {
    this.controlType = this.name;
    this.id = `${this.name}-${FormFieldControl.nextId++}`;
  }

  /**
   * destroy
   */
  ngOnDestroy(): void {
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.elementRef);
    if (this.ngControl) {
      this.ngControl.valueAccessor = null;
    }
  }

  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
      if (this.ngControl.disabled !== null && this.ngControl.disabled !== this.disabled) {
        this.disabled = this.ngControl.disabled;
        this.stateChanges.next();
      }
    }
  }

  /**
   * updateErrorState
   */
  updateErrorState() {
    this.errorStateTracker.updateErrorState();
  }


  /**
   * onContainerClick
   */
  abstract onContainerClick(event: MouseEvent): void;
}
