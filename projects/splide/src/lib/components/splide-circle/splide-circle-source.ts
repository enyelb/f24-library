import { F24SplideSource, F24SplideSourceParams } from "../splide/splide-source";

/**
 * 
 */
export interface F24SplideCircleItem {
  id: string | number;
  image: string;
  name?: string;
}

/**
 * F24SplideCircleSourceParams
 */
export interface F24SplideCircleSourceParams extends Omit<F24SplideSourceParams<F24SplideCircleItem>, 'defaults'>{ 
}
/**
 * F24SplideCircleSource
 */
export class F24SplideCircleSource extends F24SplideSource<F24SplideCircleItem> {
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public override update(params?: F24SplideCircleSourceParams, params2?: F24SplideCircleSourceParams) {
    super.update(params, params2);
  }
}
/**
 * createSplideCircleSource
 */
export const createSplideCircleSource = (params?: F24SplideCircleSourceParams) => {
  return new F24SplideSource(params);
}
/**
 * createSplideCircleSourceParams
 */
export const createSplideCircleSourceParams = (params?: F24SplideCircleSourceParams) => {
  return params;
}