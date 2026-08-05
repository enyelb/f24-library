import { computed, untracked } from "@angular/core";

import { signalSource } from "@f24/core";

/**
 * F24TimelineBasicSourceParams
 */
export interface F24TimelineBasicItemSourceParams {
  id: string;
  title: string;
  subtitle?: string;
  date?: string | Date;
  tooltip?: string;
  icon?: string;
  color?: string;
}

/**
 * F24TimelineBasicSourceParams
 */
export interface F24TimelineBasicSourceParams {
  items?: F24TimelineBasicItemSourceParams[];
  color?: string;
  lineSize?: number; 
}
/**
 * F24TimelineBasicSource
 */
export class F24TimelineBasicSource {
  /**
   * label
   * este es el label del mat input
   */
  protected readonly _items = signalSource<F24TimelineBasicItemSourceParams[]>([]);
  readonly items = computed(() => {
    const items = this._items.value();
    let current: Date | undefined = new Date();
    return items
      //.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item, index) => {
        const date = item?.date ? new Date(item?.date) : undefined;
        const color = item?.color ?? this.color();
        const isPrimaryDay = index == 0 ? true : (
          date && current ?
            date.getDay() != current.getDay() || date.getMonth() != current.getMonth() || date.getFullYear() != current.getFullYear()  :
            current != date
        );
        current = date;
        return {
          ...item, date, color, isPrimaryDay
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
   * constructor
   */
  constructor(params?: F24TimelineBasicSourceParams) {
    this.update(params);
  }
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public update(params?: F24TimelineBasicSourceParams, params2?: F24TimelineBasicSourceParams) {
    untracked(() => {
      this._items.setExectUndefined(params?.items ?? params2?.items);
      this._color.setExectUndefined(params?.color ?? params2?.color);
      this._lineSize.setExectUndefined(params?.lineSize ?? params2?.lineSize);
    });
  }
}
/**
 * createTimelineBasicSource
 */
export const createTimelineBasicSource = (params?: F24TimelineBasicSourceParams) => {
  return new F24TimelineBasicSource(params);
}
/**
 * createTimelineBasicSourceParams
 */
export const createTimelineBasicSourceParams = (params?: F24TimelineBasicSourceParams) => {
  return params;
}