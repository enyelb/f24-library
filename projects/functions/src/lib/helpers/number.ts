/**
 * porcentage
 * @param value 
 * @param total 
 * @returns 
 */
export function porcentage(value: number | string | undefined, total: number | string | undefined): number {
  return (toNumber(value) / toNumber(total) || 1) * 100;
}

/**
 * round
 * @param value 
 * @param r 
 * @returns 
 */
export function round(value: string | number | undefined, r: number = 2) : number {
  return Number(toNumber(value).toFixed(r));
}

/**
 * numberformat
 * @param value 
 * @param r 
 * @returns 
 */
export function numberformat(value: string | number, r: number = 2) : string {
  const number = typeof value === 'string' ? Number(value) : value;
  if (isNaN(number)) {
    return '';
  }

  return new Intl.NumberFormat('en-ES', {
    maximumFractionDigits: r
  }).format(number);
}

/**
 * usd
 * @param value 
 * @param r 
 * @returns 
 */
export function usd(value: string | number, r: number = 2) : string {
  return 'USD. ' + numberformat(value, r);
}

/**
 * toNumber
 * @param value
 * @returns 
*/
export function toNumber(value: number | string | undefined) : number {
  let valueNumber: number = 0;
  try{
    if(typeof value === 'string') {
      valueNumber = Number(value);
    } else if(value){
      valueNumber = value;
    }
  } catch {
    valueNumber = 0;
  }
  return valueNumber;
}

/**
 * abs
 * @param value
 * @returns 
*/
export function abs(value: number | string | undefined): number {
  return Math.abs(toNumber(value));
}

/**
 * unitMeasure
 * @param value 
 * @param unit 
 * @returns 
 */
export function unitMeasure(value: number | string | undefined, unit: 'GR' | 'UND' | 'ML') {
  const number = toNumber(value);

  const UNIT_CONFIG: Record<'GR' | 'UND' | 'ML', { unit: number; symbol: string }[]> = {
    GR: [{unit: 1,  symbol: 'g'}, {unit: 1000, symbol: 'K'}],    
    ML: [{unit: 1, symbol: 'ml'}, {unit: 1000, symbol: 'L'}],
    UND: [{unit: 1, symbol: 'und'}]
  };

  const configs = UNIT_CONFIG[unit];
  if (!configs || number == 0) { 
    return `${number}`;
  }
  
  let newNumber = `${number}`;
  for (const config of configs) {
    if (number >= config.unit) {
      const formattedValue = config.unit > 1 ? (number / config.unit).toFixed(1).replace('.0', '') : number;
      newNumber = `${formattedValue}${config.symbol}`;
      if (unit == 'UND' && number > 1) {
        newNumber = `${newNumber}s`;
      }
    }
  }
  return `${newNumber}`;
}
