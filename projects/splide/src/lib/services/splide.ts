import { Injectable } from '@angular/core';

import { F24SplideExtensions, F24SplideOptions } from '../models/splide';


/**
 * F24Splide
 */
@Injectable({
  providedIn: 'root',
})
export class F24Splide {
  /**
   * 
   */
  private splide: any; 
  private autoScroll: any;
  /**
   * loadSplide
   */
  private async loadSplide() {
    if (!this.splide) {
      const swalModule = await import('@splidejs/splide');
      this.splide = swalModule.default;
    }

    if (this.splide) {
      return this.splide;
    }
    return;
  }
  /**
   * loadAutoScroll
   */
  private async loadAutoScroll() {
    if (!this.autoScroll) {
      const swalModule = await import('@splidejs/splide-extension-auto-scroll');
      this.autoScroll = swalModule.AutoScroll;
    }

    if (this.autoScroll) {
      return this.autoScroll;
    }
    return;
  }

  /**
   * 
   * @returns 
   */
  inizialized(root: HTMLElement, options: F24SplideOptions, options2?: F24SplideOptions, extensions?: F24SplideExtensions) {
    let splide: any;
    this.loadSplide().then(async (Splide: any) => {
      if (!Splide) {
        return;
      } 
      /**
       * merge options
       */
      const mergedOptions = {
        ...options,
        ...options2 ?? {}
      }
      /**
       * inicializar splide
       */
      splide = new Splide(root, mergedOptions);
      /**
       * montar extensiones
       */
      const mount: { AutoScroll?: any } = {};
      /**
       * montar extension auto scroll
       */
      if (mergedOptions.autoScroll || extensions?.autoScroll) {
        mount.AutoScroll = await this.loadAutoScroll();
      }
      /**
       * montar splide
       */
      splide.mount(mount);
    });
    return splide;
  }
}
