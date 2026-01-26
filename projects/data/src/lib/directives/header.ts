import { Directive, TemplateRef, inject } from '@angular/core';

/**
 * F24HeaderDirective
 */
@Directive({
  selector: '[f24-header]',
  standalone: true
})
export class F24HeaderDirective<T> {
  /**
   * templete ref
   */
  readonly template = inject(TemplateRef);
}