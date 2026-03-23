import { signal } from "@angular/core";
import { AbstractControl, FormControl, ControlValueAccessor as IControlValueAccessor, NgControl } from "@angular/forms";

/**
 * ControlValueAccessor
 */
export class ControlValueAccessor implements IControlValueAccessor {
  /**
   * control
   */
  readonly control = signal<FormControl>(new FormControl(''));

  /**
   * writeValue
   * @param value
   */
  writeValue(value: any): void {
  }

  /**
   * registerOnChange
   * @param fn
   */
  registerOnChange(fn: any): void {
  }

  /**
   * registerOnTouched
   * @param fn
   */
  registerOnTouched(fn: any): void {
  }

  /**
   * setDisabledState
   * @param isDisabled
   */
  setDisabledState(isDisabled: boolean): void {
  }

  /**
   * init
   * @param ngControl
   * @param formControl
   */
  protected init(ngControl: NgControl | null, formControl: AbstractControl | null) {
    if (ngControl) {
      this.control.set(ngControl.control as FormControl);
    } else if (formControl){
      this.control.set(formControl as FormControl);
    }
  }

  /**
   * destroy
   * @param ngControl
   */
  protected destroy (ngControl: NgControl | null) {
    if (ngControl) {
      ngControl.valueAccessor = null;
    }
  }
}
