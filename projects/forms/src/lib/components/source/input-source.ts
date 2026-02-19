import { F24FormSource, F24FormSourceParams } from "./form-source";

/**
 * F24FormInputSourceParams
 */
export type F24FormInputSourceParams<Type> = F24FormSourceParams<Type> 
/**
 * F24FormInputSource
 */
export class F24FormInputSource<Type> extends F24FormSource<Type> {

}
/**
 * createFormInputSource
 */
export const createFormInputSource = <Type>(params?: F24FormInputSourceParams<Type>) => {
  return new F24FormInputSource(params);
}
/**
 * createFormInputSourceParams
 */
export const createFormInputSourceParams = <Type>(params?: F24FormInputSourceParams<Type>) => {
  return params;
}