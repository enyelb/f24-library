import { Directive, TemplateRef, input, inject } from '@angular/core';

/**
 * F24SplideItemDirective
 */
@Directive({
  selector: '[f24-splide-item]',
  standalone: true
})
export class F24SplideItemDirective<T> {
  /**
   * templete ref
   */
  readonly template = inject(TemplateRef<{
    $implicit: T;
    row: T;
  }>);
}