import { toNumber } from "./number";

/**
 * usd
 */
const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

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
  format: "USD" | "VES" = "USD"
) : string {
  let valueNumber: number = toNumber(value)

  if (format === 'VES') {
    return VES.format(valueNumber).replace("VES", "");
  } else {
    return USD.format(valueNumber);
  } 
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