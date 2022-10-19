import { useMemo } from 'react';
import { getPreferredCurrencies } from '../utils/currencies';

export const usePreferredCurrencies = () => {
  const preferredCurrencies = useMemo(
    () => getPreferredCurrencies(),
    [getPreferredCurrencies]
  );
  return {
    preferredCurrencies
  };
};
