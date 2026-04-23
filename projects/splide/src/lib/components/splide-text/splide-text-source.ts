import { F24SplideSource, F24SplideSourceParams } from "../splide/splide-source";

/**
 * 
 */
export interface F24SplideTextItem {
  id: string | number;
  text: string;
}

/**
 * F24SplideTextSourceParams
 */
export interface F24SplideTextSourceParams extends Omit<F24SplideSourceParams<F24SplideTextItem>, 'defaults'>{ 
}
/**
 * F24SplideTextSource
 */
export class F24SplideTextSource extends F24SplideSource<F24SplideTextItem> {
  /**
   * update
   * actualiza cada variable si viene en los parametros
   */
  public override update(params?: F24SplideTextSourceParams, params2?: F24SplideTextSourceParams) {
    super.update(params, params2);
  }
}
/**
 * createSplideTextSource
 */
export const createSplideTextSource = (params?: F24SplideTextSourceParams) => {
  return new F24SplideSource(params);
}
/**
 * createSplideTextSourceParams
 */
export const createSplideTextSourceParams = (params?: F24SplideTextSourceParams) => {
  return params;
}