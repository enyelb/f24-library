import { CommonModule } from '@angular/common';

import { Component, OnInit, inject, OnDestroy, input, output } from '@angular/core';
import { NgControl, ReactiveFormsModule, AbstractControl } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { ControlValueAccessor } from '../control-value';
import { FormErrors } from '../form-errors';

/**
 * FormInput
 */
@Component({
  selector: 'f24-form-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, FormErrors],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
})
export class FormInput extends ControlValueAccessor implements OnInit, OnDestroy {

  /**
   * inputs
   */
  public label = input<string>('');
  public placeholder = input<string>('');
  public type = input<string>('text');
  public formControl = input<AbstractControl | null>(null);

  /**
   * outputs
   */
  public changes = output<any>()

  /**
   * injects
   */
  private ngControl = inject(NgControl, {
    optional: true,
    self: true,
  });


  /**
   * constructor
   */
  constructor() {
    super();

    // Configurar el value accessor
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  /**
   * ngOnInit
   */
  ngOnInit(): void {
    this.init(this.ngControl, this.formControl());
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroy(this.ngControl);
  }

  /**
   * changeEmit
   * @param event
   * @returns
   */
  protected changeEmit() {
    setTimeout(() => {
      this.changes.emit(this.control().value);
    }, 0)
  }

}
