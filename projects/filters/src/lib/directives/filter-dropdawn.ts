import { Directive, TemplateRef, inject } from '@angular/core';

/**
 * F24FilterDropdawn
 */
@Directive({
  selector: '[f24-filter-dropdawn]',
  standalone: true
})
export class F24FilterDropdawn<T> {
  /**
   * templete
   */
  readonly template = inject(TemplateRef<{
    $implicit: T;
  }>);
}