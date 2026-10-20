import { BaseOptions } from './base';

/**
 * Re-exports all the symbols from the base module.
 */
export * from './base';

/**
 * CreateOptions
 */
export interface CreateOptions extends BaseOptions {
  backend?: 'laravel' | 'nest';
}