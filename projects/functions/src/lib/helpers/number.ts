/**
 * porcentage
 * @param value 
 * @param total 
 * @returns 
 */
export function porcentage(value: number | string | undefined, total: number | string | undefined): number {
  let valueNumber: number = 0, totalNumber: number = 0;
    
  try{
    if(typeof value === 'string') {
      valueNumber = Number(value);
    } else if(value){
      valueNumber = value;
    }
    if(typeof total === 'string') {
      totalNumber = Number(total);
    } else if(total){
      totalNumber = total;
    }
  } catch {
    valueNumber = 0;
    totalNumber = 1;
  }

  return (valueNumber / totalNumber) * 100;
}

/**
 * round
 * @param value 
 * @param r 
 * @returns 
 */
export function round(value: string | number | undefined, r: number = 2) : number {
  const number = toNumber(value);
  return Number(number.toFixed(r));
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