import { Component, input } from '@angular/core';

/**
 * F24Status
 */
@Component({
  selector: 'f24-status',
  templateUrl: './status.html',
  styleUrl: './status.scss',
  standalone: true,
  imports: [],
})
export class F24Status {

  /**
   * inputs
   */
  readonly status = input.required<string>();
  readonly color = input('black');
  readonly background = input('white');

}
