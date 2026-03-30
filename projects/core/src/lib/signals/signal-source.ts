import { signal, WritableSignal, CreateSignalOptions, Signal } from "@angular/core";

/**
 * F24Signal
 */
export class F24SignalSource<T> {
  /**
   * value
   */
  readonly value: WritableSignal<T>;
  /**
   * constructor
   * 
   * @param intialValue valor inicial del signal
   * @param options opciones para la cracion del signal
   */
  constructor(intialValue: T, options?: CreateSignalOptions<T> | undefined ) { 
    this.value = signal(intialValue, options);
  }
  /**
   * actualizar signal
   * 
   * @param updateFn funcion para actualiar
   */
  update(updateFn: (value: T) => T): void {
    this.value.update(updateFn);
  }
  /**
   * solo lectura
   */
  asReadonly(): Signal<T> {
    return this.value.asReadonly();
  }
  /**
   * cambiar signal
   * 
   * @param value valor nuevo
   */
  set(value: T): void {
    this.value.set(value);
  }
  /**
   * cambiar solo si no es undefined
   * 
   * @parma value nuevo valor
   * @param transform funcion que tranforma el valor en caso de ser necesario
   */
  public setExectUndefined<R>(value: R | undefined, transform?: (value: R) => T): void {
    if (value !== undefined && value !== this.value()) {
      this.value.set(transform ? transform(value as R) : value as T);
    }
  }

  /**
   * si es un array o un objeto actualiza los datos
   * 
   * @parma value nuevo valor
   */
  public append(value: T | undefined) {
    if (value !== undefined && value instanceof Array) {
      this.value.update(v => [... v instanceof Array ? v : [], ...value] as T);
    } else if (value !== undefined && typeof value === 'object') {
      this.value.update(v => ({ ...v, ...value } as T));
    }
  }
}

/**
 * funcion para crear signal 
 */
export function signalSource<T>(initialValue: T, options?: CreateSignalOptions<T> | undefined): F24SignalSource<T> {
  return new F24SignalSource<T>(initialValue, options);
}