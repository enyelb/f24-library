import { Directive, ElementRef } from '@angular/core';

/**
 * F24TouchScrollDirective
 */
@Directive({
  selector: '[f24TouchScroll]',
  standalone: true,
  host: {
    '(touchstart)': 'onTouchStart($event)',
    '(touchmove)': 'onTouchMove($event)',
  }
})
export class F24TouchScrollDirective {
  /**
   * 
   */
  private startX = 0;
  private startY = 0;
  /**
   * constructor
   * @param el 
   */
  constructor(private el: ElementRef<HTMLElement>) {}
  /**
   * onTouchStart
   * @param event 
   */
  onTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
    }
  }
  /**
   * onTouchMove
   * @param event 
   * @returns 
   */
  onTouchMove(event: TouchEvent) {
    if (event.touches.length !== 1) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - this.startX;
    const deltaY = touch.clientY - this.startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > 5 || absDeltaY > 5) {
      if (absDeltaX > absDeltaY) {
        event.stopPropagation();
        //event.preventDefault();

        const container = this.el.nativeElement;
        container.scrollLeft -= (deltaX * 2);

        this.startX = touch.clientX;
        this.startY = touch.clientY;
      }
    }
  }
}