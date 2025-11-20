import { Component, Input } from '@angular/core';

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
   * status
   */
  @Input() status!: string;

  /**
   * color
   */
  @Input() color: string = 'black';

  /**
   * background
   */
  @Input() background: string = 'white';

}
