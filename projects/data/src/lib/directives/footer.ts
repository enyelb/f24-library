import { Directive, TemplateRef, inject } from '@angular/core';

/**
 * F24FooterDirective
 */
@Directive({
  selector: '[f24-footer]',
  standalone: true
})
export class F24FooterDirective {
  /**
   * templete ref
   */
  readonly template = inject(TemplateRef);
}