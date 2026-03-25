import { signal, WritableSignal } from "@angular/core";

/**
 * F24SignalMap
 */
export class F24SignalMap<T> {
  /**
   * map
   */
  private readonly _map = new Map<string, WritableSignal<T>>();
  /**
   * initialValue
   */
  private readonly _initialValue: T;
  /**
   * constructor
   */
  constructor(initialValue: T) {
    this._initialValue = initialValue;
  }
  /**
   * obtiene el valor del signal
   */
  public signal(key: string): WritableSignal<T> {
    if (!this._map.has(key)) {
      this._map.set(key, signal(this._initialValue));
    }
    return this._map.get(key)!;
  }
  /**
   * obtiene el valor dentro del signal
   */
  public get(key: string, transform?: (value: T) => T): T {
    const value = this.signal(key);
    if (value) {
      if (transform) {
        return transform(value());
      }
      return value();
    }
    return this._initialValue;
  }
  /**
   * asigna el valor al signal
   */
  public set(key: string, value: T) {
    const signal = this.signal(key);
    if (signal) {
      signal.set(value);
    }
  }
  /**
   * asigna el valor a todos los signals 
   */
  public setAll(value: T) {
    for (const signal of this._map.values()) {
      signal.set(value);
    }
  }
  /**
   * obtiene el objeto con sus propiedades
   */
  public object() {
    const propeties: { [key: string]: T } = {};
    for (const [key, value] of this._map) {
      propeties[key] = value();
    }
    return propeties;
  }
}

/**
 * funcion para crear signals map
 */
export function signalMap<T>(initialValue: T): F24SignalMap<T> {
  return new F24SignalMap<T>(initialValue);
}