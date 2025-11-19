import { Type } from "@angular/core";

/**
 * LazyId
 */
export type LazyId<C> = string | Type<C>;


/**
 * LazyModule
 */
export interface LazyModule<C> {
  (): Promise<Type<C>>
}

/**
 * LazyPost
 */
export interface LazyPost<C> {
  (component: C): void
}

/**
 * LazyInputs
 */
export interface LazyInputs {
  (): {}
}

/**
 * LazyComponent
 */
export interface LazyComponent<C> {
  (component: C): void
}
