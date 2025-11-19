import { LazyId, LazyInputs, LazyModule, LazyPost } from "../lazy";

/**
 * ResponsiveViewSize
 */
export type ResponsiveViewSize = 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';

/**
 * ResponsiveViewComponent
 */
export interface ResponsiveViewComponent<C> {
  sizes: ResponsiveViewSize[]
  id: LazyId<C>
  module: LazyModule<C>
  post?: LazyPost<C>
  inputs?: LazyInputs
}
