import { Directive, TemplateRef, inject } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

/**
 * F24FormTree
 */
@Directive({
  selector: '[f24-form-tree]',
  standalone: true
})
export class F24FormTree<T> {
  /**
   * templete
   */
  readonly template = inject(TemplateRef<{
    $implicit: FieldTree<T>;
  }>);
}