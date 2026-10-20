import { signal, WritableSignal } from "@angular/core";
import { Observable } from "rxjs";

/**
 * F24SelectRequest
 */ 
type F24SelectRequest<Type> = () => Observable<Type[]> | Type[] | WritableSignal<Type[]>;
/**
 * F24SelectFormatter
 */
type F24SelectFormatter<Type> = (data: Type) => string;
/**
 * F24SelectFormatterObject
 */
type F24SelectFormatterObject<Type> = {
  label?: F24SelectFormatter<Type>;
  option?: F24SelectFormatter<Type>;
};
/**
 * F24SelectFormatters
 */
export type F24SelectFormatters<Type> =
  | F24SelectFormatter<Type>
  | F24SelectFormatterObject<Type>
  | Record<string, F24SelectFormatter<Type> | F24SelectFormatterObject<Type>> | undefined;
/**
 * F24SelectSourceParams
 */
export interface F24SelectSourceParams<Select, Formatters extends F24SelectFormatters<Select>> {
  request?: F24SelectRequest<Select>;
  items?: Select[];
  formatters: Formatters;
}
/**
 * F24SelectSource
 */
export class F24SelectSource<Select, Formatters extends F24SelectFormatters<Select>> {
  /**
   * request
   */
  private readonly _request: F24SelectRequest<Select> | undefined;
  private loadRequest = false;
  /**
   * items
   */
  private readonly _items = signal<Select[]>([]);
  /**
   * formatters
   */
  private readonly _formatters: Formatters;
  /**
   * constructor
   */
  constructor(params: F24SelectSourceParams<Select, Formatters>) {
    this._request = params?.request;
    this._items.set(params?.items ?? []);
    this._formatters = params?.formatters;
  }
  /**
   * items
   */
  get items() {
    const items = this._items();

    if (!this.loadRequest) {
      this.request();
    }

    return items;
  }
  /**
   * formatters
   */
  get formatters() {
    return this._formatters;
  }
  /**
   * request
   */
  private request() {
    if (!this._request) {
      return;
    }

    const response = this._request();

    if (response instanceof Observable) {
      response.subscribe((items) => {
        this.setItems(items);
      });
    } else if (response instanceof Array) {
      this.setItems(response);
    } else {
      this.setItems(response());
    }
  }

  /**
   * setItems
   */
  private setItems(items: Select[]) {
    setTimeout(() => {
      this._items.set(items);
    }, 100);
    this.loadRequest = true;
  }

  /**
   * append
   */
  public append(select: Select) {
    this._items.update(old => [...old, select]);
  }
     
}
/**
 * createSelectSource
 */
export function createSelectSource<Select, Formatters extends F24SelectFormatters<Select>>(params: F24SelectSourceParams<Select, Formatters>) {
  return new F24SelectSource(params);
}