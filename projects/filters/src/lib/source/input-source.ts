import { F24FilterSourceForm, F24FilterSourceFormParams } from "./form-source";
/**
 * Params
 */
export type F24FilterSourceInputType = string | number;
/**
 * F24FilterSourceParams
 */
export type F24FilterSourceInputParams<Type extends F24FilterSourceInputType> = F24FilterSourceFormParams<Type> 
/**
 * F24FilterSourceInput
 */
export class F24FilterSourceInput<Type extends F24FilterSourceInputType> extends F24FilterSourceForm<Type> {

}
/**
 * createFilterSourceInput
 */
export const createFilterSourceInput = <Type extends F24FilterSourceInputType>(params?: F24FilterSourceFormParams<Type>) => {
  return new F24FilterSourceInput(params);
}
/**
 * createFilterSourceInputParams
 */
export const createFilterSourceInputParams = <Type extends F24FilterSourceInputType>(params?: F24FilterSourceInputParams<Type>) => {
  return params;
}