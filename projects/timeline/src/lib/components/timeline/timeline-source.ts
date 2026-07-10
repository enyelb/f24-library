import { computed, untracked } from "@angular/core";

import { signalSource } from "@f24/core";

/**
 * F24TimelineSourceParams
 */
export interface F24TimelineItemSourceParams {
  id: string;
  title: string;
  subtitle?: string;
  date: string | Date;
  tooltip?: string;
  icon?: string;
  direction?: 'left' | 'right';
  color?: string;
  format?: string | string[];
}

/**
 * F24TimelineSourceParams
 */
export interface F24TimelineSourceParams {
  items?: F24TimelineItemSourceParams[];
  direction?: 'left' | 'right' | 'alternate';
  color?: string;
  format?: string | string[];
  lineSize?: number; 
}
/**
 * F24TimelineSource
 */
export class F24TimelineSource {
  /**
   * label
   * este es el label del mat input
   */
  protected readonly _items = signalSource<F24TimelineItemSourceParams[]>([]);
  readonly items = computed(() => {
    const items = this._items.value();
    const globalDirection = this.direction();
    return items
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item, index) => {
        const date = new Date(item?.date);
        const color = item?.color ?? this.color();
        const format = item?.format instanceof Array ? item.format : item.format ? [item.format] : this.format();
        const direction = item?.direction ?? (globalDirection === 'alternate' ? (index % 2 === 0 ? 'left' : 'right') : globalDirection);
        return {
          ...item, date, direction, color, format
        }
      });
  });
  /** 
   * direction
   * este es el label del mat input
   */
  protected readonly _direction = signalSource<'left' | 'right' | 'alternate'>('alternate');
  readonly direction = this._direction.asReadonly();
  /**
   * color
   * este es el label del mat input
   */
  protected readonly _color = signalSource<string>('lavender');
  readonly color = this._color.asReadonly();
  /**
   * format
   */
  protected readonly _format = signalSource<string[] | string>(['dd/MM/yyyy']);
  readonly format = computed(() => {
    const format = this._format.value();
    return format instanceof Array ? format : [format];
  });
  /**
   * 
   */
  protected readonly _lineSize = signalSource<number>(7);
  readonly lineSize = this._lineSize.asReadonly();
  /**
   * hasLeft
   */
  readonly hasLeft = computed(() => {
    return this.direction() === 'left' || (this.direction() === 'alternate' && this.items().some(item => item.direction === 'left'));
  });
  readonly hasRight = computed(() => {
    return this.direction() === 'right' || (this.direction() === 'alternate' && this.items().some(item => item.direction === 'right'));
  });
  /**
   * constructor
   */
  constructor(params?: F24TimelineSourceParams) {
    this.update(params);
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24TimelineSourceParams, params2?: F24TimelineSourceParams) {
    untracked(() => {
      this._direction.setExectUndefined(params?.direction ?? params2?.direction);
      this._items.setExectUndefined(params?.items ?? params2?.items);
      this._color.setExectUndefined(params?.color ?? params2?.color);
      this._format.setExectUndefined(params?.format ?? params2?.format);
      this._lineSize.setExectUndefined(params?.lineSize ?? params2?.lineSize);
    });
  }
}
/**
 * createTimelineSource
 */
export const createTimelineSource = (params?: F24TimelineSourceParams) => {
  return new F24TimelineSource(params);
}
/**
 * createTimelineSourceParams
 */
export const createTimelineSourceParams = (params?: F24TimelineSourceParams) => {
  return params;
}