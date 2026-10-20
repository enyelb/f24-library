import { Component, computed, input, TemplateRef } from '@angular/core';
import { FormField } from '@angular/forms/signals';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { F24Icon } from '@f24/layout'

import { F24FormErrors } from '../form-errors';

import { createFormInputSource, F24FormInputSource, F24FormInputSourceParams } from './form-input-source';
import { NgTemplateOutlet } from '@angular/common';

/**
 * F24FormInput
 */
@Component({
  selector: 'f24-form-input',
  standalone: true,
  imports: [
    NgTemplateOutlet, FormField, 
    MatFormFieldModule, MatInputModule, MatIconModule, 
    F24FormErrors, F24Icon
  ],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
})
export class F24FormInput {
  /**
   * source 
   */
  readonly source = input<F24FormInputSource>();
  /**
   * inputs
   */
  readonly label = input<F24FormInputSourceParams['label']>();
  readonly appearance = input<F24FormInputSourceParams['appearance']>();
  readonly name = input<F24FormInputSourceParams['name']>();
  readonly icon = input<F24FormInputSourceParams['icon']>();
  readonly placeholder = input<F24FormInputSourceParams['placeholder']>();
  readonly form = input<F24FormInputSourceParams['form']>();
  readonly type = input<F24FormInputSourceParams['type']>();

  readonly templateSuffix = input<TemplateRef<any>>();
  /**
   * signals resolved
   */
  readonly resolvedLabel = computed(() => this.source()?.label() ?? this.label() ?? '');
  readonly resolvedAppearance = computed(() => this.source()?.appearance() ?? this.appearance() ?? 'outline');
  readonly resolvedName = computed(() => this.source()?.name() ?? this.name() ?? '');
  readonly resolvedIcon = computed(() => this.source()?.icon() ?? this.icon() ?? '');
  readonly resolvedPlaceholder = computed(() => this.source()?.placeholder() ?? this.placeholder() ?? '');
  readonly resolvedForm = computed(() => this.source()?.form() ?? this.form() ?? null);
  readonly resolvedType = computed(() => this.source()?.type() ?? this.type() ?? 'text');
  
}
