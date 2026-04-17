import { F24SplideAutoScrollOptions } from "./splide-auto-scroll";

/**
 * I18N
 */
export const I18N = {
  prev      : 'Previous slide',
  next      : 'Next slide',
  first     : 'Go to first slide',
  last      : 'Go to last slide',
  slideX    : 'Go to slide %s',
  pageX     : 'Go to page %s',
  play      : 'Start autoplay',
  pause     : 'Pause autoplay',
  carousel  : 'carousel',
  slide     : 'slide',
  select    : 'Select a slide to show',
  slideLabel: '%s of %s',
};

/**
 * F24ResponsiveOptions
 */
export interface F24ResponsiveOptions {
  [ key: string ]: any;
  label?: string;
  labelledby?: string;
  speed?: number;
  rewind?: boolean;
  rewindSpeed?: number;
  rewindByDrag?: boolean;
  width?: number | string;
  height?: number | string;
  fixedWidth?: number | string;
  fixedHeight?: number | string;
  heightRatio?: number;
  perPage?: number;
  perMove?: number;
  clones?: number;
  cloneStatus?: boolean;
  focus?: number | 'center';
  gap?: number | string;
  padding?:
    | number
    | string
    | { left?: number | string, right?: number | string }
    | { top?: number | string, bottom?: number | string };
  arrows?: boolean;
  pagination?: boolean;
  paginationKeyboard?: boolean;
  paginationDirection?: F24SplideOptions['direction'];
  easing?: string;
  easingFunc?: ( t: number ) => number;
  drag?: boolean | 'free';
  snap?: boolean;
  dragMinThreshold?: number | { mouse: number, touch: number };
  flickPower?: number;
  flickMaxPages?: number;
  destroy?: boolean | 'completely';
}
/**
 * F24SplideOptions
 */
export interface F24SplideOptions extends F24ResponsiveOptions {
  type?: string;
  role?: string;
  waitForTransition?: boolean;
  autoWidth?: boolean;
  autoHeight?: boolean;
  start?: number;
  arrowPath?: string;
  autoplay?: boolean | 'pause';
  interval?: number;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  resetProgress?: boolean;
  lazyLoad?: boolean | 'nearby' | 'sequential';
  preloadPages?: number;
  keyboard?: boolean | 'global' | 'focused';
  wheel?: boolean;
  wheelMinThreshold?: number;
  wheelSleep?: number;
  releaseWheel?: boolean;
  direction?: 'ltr' | 'rtl' | 'ttb';
  cover?: boolean;
  slideFocus?: boolean;
  isNavigation?: boolean;
  trimSpace?: boolean | 'move';
  omitEnd?: boolean;
  updateOnMove?: boolean;
  mediaQuery?: 'min' | 'max';
  focusableNodes?: string;
  noDrag?: string;
  live?: boolean;
  useScroll?: boolean;
  breakpoints?: Record<string | number, F24ResponsiveOptions>,
  reducedMotion?: F24SplideOptions;
  classes?: Record<string, string>;
  i18n?: Record<keyof typeof I18N | string, string>;
  autoScroll?: F24SplideAutoScrollOptions;
}


export interface F24SplideExtensions {
  autoScroll?: boolean;
}