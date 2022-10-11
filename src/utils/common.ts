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
