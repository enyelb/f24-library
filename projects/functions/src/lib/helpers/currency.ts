import { toNumber } from "./number";

/**
 * ves
 */
const VES = new Intl.NumberFormat('en-ES', {
  style: 'currency',
  currency: 'VES',
});

/**
 * usd
 * @param value 
 * @param r 
 * @returns 
 */
export function currency(
  value: number | string | undefined,
) : string {
  let valueNumber: number = toNumber(value)
  return VES.format(valueNumber).replace("VES", ""); 
}

/**
 * toUsd
 * @param value 
 * @param rate 
 * @returns 
 */
export function toUsd(value: number | string | undefined, rate: number | string | undefined) : number {
  const valueNumber = toNumber(value);
  const rateNumber = toNumber(rate);
  if (rateNumber === 0) {
    return 0;
  }
  return valueNumber / rateNumber;
}

/**
 * toVes
 */
export function toVes(value: number | string | undefined, rate: number | string | undefined): number {
  const valueNumber = toNumber(value);
  const rateNumber = toNumber(rate);
  if (rateNumber === 0) {
    return 0;
  }
  return valueNumber * rateNumber;
}