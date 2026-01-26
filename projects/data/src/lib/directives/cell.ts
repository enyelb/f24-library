import { Directive, TemplateRef, input, inject } from '@angular/core';

/**
 * F24CellDirective
 */
@Directive({
  selector: '[f24-cell]',
  standalone: true
})
export class F24CellDirective<T> {
  /**
   * templete ref
   */
  readonly template = inject(TemplateRef<{
    $implicit: T;
    row: T;
  }>);
  /**
   * cell
   */
  readonly cell = input<T | null>(null);
}