import { Component, Input } from '@angular/core';

import { MtxPhotoviewerModule } from '@ng-matero/extensions/photoviewer';

/**
 * F24ImageComponent
 */
@Component({
  selector: 'f24-image',
  standalone: true,
  imports: [MtxPhotoviewerModule],
  templateUrl: './image.html',
  styleUrls: ['./image.scss'],
})
export class F24Image {

  /**
   * src
   */
  @Input() src!: string;

  /**
   * alt
   */
  @Input() alt!: string;

  /**
   * default
   */
  @Input() default!: string;

  /**
   * notfound
   */
  protected notfound: boolean = false;

  /**
   * notfound
   */
  protected notfoundDefault: boolean = false;

   /**
   * error
   */
  error(e: ErrorEvent) {
    this.notfound = true;
  }

  /**
   * error
   */
  errorDefault(e: ErrorEvent) {
    this.notfoundDefault = true;
  }
}
