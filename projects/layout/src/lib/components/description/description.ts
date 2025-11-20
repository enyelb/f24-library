import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * F24Description
 */
@Component({
  selector: 'f24-description',
  templateUrl: './description.html',
  styleUrl: './description.scss',
  standalone: true,
  imports: [NgClass, MatIconModule, MatTooltipModule],
})
export class F24Description {

  /**
   * description
   */
  @Input() description!: string;

  /**
   * icon
   */
  @Input() icon?: {
    name: string;
    color?: string;
    tooltip?: string;
    hide?: boolean;
  };


  @Input() items: {
    icon: string,
    text: string
  }[] = [];
}
