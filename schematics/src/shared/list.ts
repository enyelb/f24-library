import { BaseOptions } from './base';

/**
 * Re-exports all the symbols from the base module.
 */
export * from './base';

/**
 * ListOptions
 */
 export interface ListOptions extends BaseOptions {
  backend?: 'laravel' | 'nest';
}