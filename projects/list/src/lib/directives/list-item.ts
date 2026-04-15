import { Directive, TemplateRef, input, inject } from '@angular/core';

/**
 * F24ListItem
 */
@Directive({
  selector: '[f24-list-item]',
  standalone: true
})
export class F24ListItem<T> {
  /**
   * templete
   */
  readonly template = inject(TemplateRef<{
    $implicit: T;
  }>);
  /**
   * track
   */
  readonly track = input<string | number>();
}