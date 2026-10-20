/**
 * ModelAPIOptions
 */
export interface ModelAPIOptionsUnsafe {
  name: string;
  path?: string;
  style?: 'scss' | 'css' | 'none';
  prefix?: string;
  module: 'create' | 'update' | 'list'
  folder: 'local' | 'backend'
  backend?: 'laravel' | 'nest';
}

/**
 * ModelAPIOptions
 */
export interface ModelAPIOptions extends Omit<ModelAPIOptionsUnsafe, 'module'> {
  module: 'create' | 'update' | ''
}

/**
 * safeOptions
 */
export function safeOptions(options: ModelAPIOptionsUnsafe): ModelAPIOptions {
  return {
    ...options,
    module: options.module === 'list' ? '' : options.module,
  }
}