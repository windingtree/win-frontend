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
