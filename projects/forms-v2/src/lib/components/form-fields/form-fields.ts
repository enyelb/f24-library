import { Component, computed, contentChildren, input, ViewEncapsulation } from '@angular/core';

import { NgTemplateOutlet } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';

import { F24Container } from '@f24/layout';
import { F24ButtonIcon } from '@f24/buttons'

import { F24FormTree } from '../../directives/form-tree';

import { F24FormFieldsSource, F24FormFieldsSourceParams } from './form-fields-source';

/**
 * F24FormFields
 */
@Component({
  selector: 'f24-form-fields',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    MatButtonModule, 
    F24Container, F24ButtonIcon
  ],
  templateUrl: './form-fields.html',
  styleUrl: './form-fields.scss',
  encapsulation: ViewEncapsulation.None,
})
export class F24FormFields<T> {
  /**
   * childrens
   */
  protected readonly formTreeTemplate = contentChildren<F24FormTree<T>>(F24FormTree); 
  /**
   * inputs
   */
  readonly source = input<F24FormFieldsSource<T>>();
  readonly title = input<F24FormFieldsSourceParams<T>['title']>();
  readonly fields = input<F24FormFieldsSourceParams<T>['fields']>();
  readonly model = input<F24FormFieldsSourceParams<T>['model']>();
  /**
   * signals resolved
   */
  readonly resolvedTitle = computed(() => this.source()?.title() ?? this.title() ?? '');
  readonly resolvedFields = computed(() => this.source()?.fields() ?? this.fields()); 
  readonly resolvedModel = computed(() => this.source()?.model() ?? this.model() ?? {} as T);
  /**
   * 
   */
  addItem() {
    const fieldsTree = this.resolvedFields();
    if (!fieldsTree) {
      return;
    }
    const fieldsState = fieldsTree();
    const model = this.resolvedModel();
    fieldsState.controlValue.update((values) => [...values, { ...model }]);
  }
  /**
   * 
   */
  removeItem(index: number) {
    const fieldsTree = this.resolvedFields();
    if (!fieldsTree) {
      return;
    }
    const fieldsState = fieldsTree();
    fieldsState.controlValue.update((values) => values.filter((_, i) => i !== index));
  }
}
