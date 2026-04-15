import { Directive, TemplateRef, input, inject } from '@angular/core';

/**
 * F24ItemDirective
 */
@Directive({
  selector: '[f24-item]',
  standalone: true
})
export class F24ItemDirective<T> {
  /**
   * templete ref
   */
  readonly template = inject(TemplateRef<{
    $implicit: T;
    item: T;
  }>);
  /**
   * item
   */
  readonly item = input<T | null>(null);
}