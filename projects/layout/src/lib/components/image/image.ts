import { Component, input } from '@angular/core';

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
   * inputs
   */
  readonly src = input('');
  readonly alt = input('');
  readonly default = input('');

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
