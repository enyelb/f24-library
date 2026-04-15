import { Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { ScrollingModule } from '@angular/cdk/scrolling';

/**
 * F24TableScroll
 */
@Component({
  selector: 'f24-table-scroll',
  imports: [ScrollingModule, NgTemplateOutlet],
  templateUrl: './table-scroll.html',
  styleUrl: './table-scroll.scss',
  standalone: true,
})
export class F24TableScroll {
  /**
   * size
   */
  readonly pageSize = input(0);
  /**
   * itemSize
   */
  readonly itemSize = input(52);


}
