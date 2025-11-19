import { Component, Input, signal } from '@angular/core';

/**
 * Loader
 */
@Component({
  selector: 'f24-loader',
  styleUrls: ['loader.scss'],
  templateUrl: 'loader.html',
  standalone: true,
  imports: [],
})
export class Loader {

  /**
   * isLoading
   */
  @Input() isLoading = signal(true);
}
