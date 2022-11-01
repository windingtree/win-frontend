import { stringToNumber } from './strings';

export const emptyFunction = () => {
  //
};

export const debouncedFn = (func: (...args: unknown[]) => unknown, delay = 500) => {
  let timeoutId;
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(func, delay);
    return () => clearTimeout(timeoutId); // call to cancel debounce
  };
};

export const isBetween = (
  value: number,
  lowerBoundary: number,
  higherBoundary: number,
  inclusive = true
) => {
  return inclusive
    ? value >= lowerBoundary && value <= higherBoundary
    : value > lowerBoundary && value < higherBoundary;
};

export const roundToNearest = (value: string | number, nearestMultiple: number) => {
  const numValue =
    typeof value === 'number'
      ? value
      : (stringToNumber(value, undefined, false) as number);
  if (!numValue) return numValue;

  // round off decimals
  const roundedValue = Math.round(numValue);

  // get quotient & remainder of value/nearest
  const quotient = Math.floor(roundedValue / nearestMultiple);
  const remainder = roundedValue % nearestMultiple;

  // if quotient is zero i.e nearestMultiple > value
  if (quotient === 0) {
    // return nearestMultiple
    return nearestMultiple;
  }

  // if remainder/nearestMultiple < 0.5
  if (remainder / nearestMultiple < 0.5) {
    return quotient * nearestMultiple;
  }

  // else
  else {
    return (quotient + 1) * nearestMultiple;
  }
};
