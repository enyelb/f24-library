import { afterRenderEffect, Component, computed, input, TemplateRef, untracked } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormField } from '@angular/forms/signals';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MtxSelectModule } from '@ng-matero/extensions/select';
import { MatIconModule } from '@angular/material/icon';

import { F24Icon } from '@f24/layout';

import { F24FormErrors } from '../form-errors';

import { 
  F24FormSelectSource, F24FormSelectSourceParams, 
  F24FormSelectBindSourceParams, F24FormSelectFormatterSourceParams
} from './form-select-source';

/**
 * F24FormSelect
 */
@Component({
  selector: 'f24-form-select',
  standalone: true,
  imports: [
    NgTemplateOutlet, FormField,
    MatFormFieldModule, MtxSelectModule, MatIconModule,
    F24FormErrors, F24Icon,
    
],
  templateUrl: './form-select.html',
  styleUrl: './form-select.scss',
})
export class F24FormSelect<Type, Item> {
  /**
   * source 
   */
  readonly source = input<F24FormSelectSource<Type, Item>>();
  /**
   * inputs
   */
  readonly label = input<F24FormSelectSourceParams<Type, Item>['label']>();
  readonly appearance = input<F24FormSelectSourceParams<Type, Item>['appearance']>();
  readonly name = input<F24FormSelectSourceParams<Type, Item>['name']>();
  readonly icon = input<F24FormSelectSourceParams<Type, Item>['icon']>();
  readonly default = input<F24FormSelectSourceParams<Type, Item>['default']>();
  readonly placeholder = input<F24FormSelectSourceParams<Type, Item>['placeholder']>();
  readonly form = input<F24FormSelectSourceParams<Type, Item>['form']>();
  readonly type = input<F24FormSelectSourceParams<Type, Item>['type']>();
  readonly multiple = input<F24FormSelectSourceParams<Type, Item>['multiple']>();
  readonly items = input<F24FormSelectSourceParams<Type, Item>['items']>();
  readonly formatterLabel = input<F24FormSelectFormatterSourceParams<Item>>();
  readonly formatterOption = input<F24FormSelectFormatterSourceParams<Item>>();
  readonly bindLabel = input<F24FormSelectBindSourceParams>();
  readonly bindValue = input<F24FormSelectBindSourceParams>();

  readonly templateSuffix = input<TemplateRef<any>>();
  /**
   * signals resolved
   */
  readonly resolvedLabel = computed(() => this.source()?.label() ?? this.label() ?? '');
  readonly resolvedAppearance = computed(() => this.source()?.appearance() ?? this.appearance() ?? 'outline');
  readonly resolvedName = computed(() => this.source()?.name() ?? this.name() ?? '');
  readonly resolvedIcon = computed(() => this.source()?.icon() ?? this.icon() ?? '');
  readonly resolvedDefault = computed(() => this.source()?.default() ?? this.default() ?? null);
  readonly resolvedPlaceholder = computed(() => this.source()?.placeholder() ?? this.placeholder() ?? '');
  readonly resolvedForm = computed(() => this.source()?.form() ?? this.form() ?? null);
  readonly resolvedType = computed(() => this.source()?.type() ?? this.type() ?? 'text');
  readonly resolvedMultiple = computed(() => this.source()?.multiple() ?? this.multiple() ?? false);
  readonly resolvedItems = computed(() => this.source()?.items() ?? this.items() ?? []);
  readonly resolvedBindLabel = computed(() => this.source()?.bindLabel() ?? this.bindLabel() ?? 'title');
  readonly resolvedBindValue = computed(() => this.source()?.bindValue() ?? this.bindValue() ?? 'value');
  readonly resolvedFormatterLabel = computed(() => this.source()?.formatterLabel() ?? this.formatterLabel() ?? this.resolvedFormatterLabelDefault);
  readonly resolvedFormatterOption = computed(() => this.source()?.formatterOption() ?? this.formatterOption() ?? this.resolvedFormatterLabelDefault);
  
  private readonly resolvedFormatterLabelDefault = (item: Item) => {
    const key = this.resolvedBindLabel()
    const value = item && typeof item === 'object' && Object.hasOwn(item, key) ? (item as any)[key] : undefined;
    return value;
  }
  private readonly resolvedFormatterValueDefault = (item: Item) => {
    const key = this.resolvedBindValue()
    const value = item && typeof item === 'object' && Object.hasOwn(item, key) ? (item as any)[key] : undefined;
    return value;
  }

  constructor() {
    afterRenderEffect(() => {
      const items = this.resolvedItems();
      untracked(() => {
        const form = this.resolvedForm();
        if (!form || items.length == 0) {
          return;
        }
        if(!items.some((item) => this.resolvedFormatterValueDefault(item) === form().controlValue())) {
          form().controlValue.set(null);
        }
      })
    })
  }
}
