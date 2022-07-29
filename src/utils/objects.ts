const circularReplacer = (maxCopies = 3) => {
  const seen = new WeakMap();
  const copies = {};

  return (key: string, value: unknown) => {
    if (value !== null && typeof value === 'object') {
      if (seen.has(value) && seen.get(value) !== key) {
        if (copies[key] >= maxCopies) {
          return '[Circular]';
        } else {
          copies[key] = copies[key] ? copies[key]++ : (copies[key] = 1);
          return value;
        }
      }
      seen.set(value, key);
    }
    return value;
  };
};

// Stringifies objects with circular dependencies
export const safeObjectStringify = (
  object: unknown,
  indent?: number,
  maxCopies?: number
): string => JSON.stringify(object, circularReplacer(maxCopies), indent);
