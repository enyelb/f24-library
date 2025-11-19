export * from './date';
export * from './color';
export * from './number';
export * from './currency';


/**
 * xlsx capitalize
 */
export function capitalize(value: string) : string {
  if (!value) return value;
  let newvalue = value.length > 0 ? value[0].toUpperCase() : '';
  newvalue += value.length > 0 ? value.slice(1).toLowerCase() : '';
  return  newvalue;
}
