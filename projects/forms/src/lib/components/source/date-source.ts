import { format } from "date-fns";
import { F24FormSource, F24FormSourceParams } from "./form-source";

/**
 * F24FormDateSourceParams
 */
export type F24FormDateSourceParams = F24FormSourceParams<string | Date>;
/**
 * F24FormDateSource
 */
export class F24FormDateSource extends F24FormSource<string | Date> {
  /**
   * changeParams
   */
  protected override changeParams(params?: F24FormDateSourceParams) {
    const value = (params?.default && (typeof params.default === 'string' || params.default instanceof Date) ?
      format(params.default, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));

    return {
      ...params,
      default: value,
    }
  }
}
/**
 * createFormDateSource
 */
export const createFormDateSource = (params?: F24FormDateSourceParams) => {
  return new F24FormDateSource(params);
}
/**
 * createFormDateSourceParams
 */
export const createFormDateSourceParams = (params?: F24FormDateSourceParams) => {
  return params;
}