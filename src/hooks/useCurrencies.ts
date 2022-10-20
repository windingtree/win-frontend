import { useMemo } from 'react';
import { getDisplayCurrencies } from '../utils/currencies';

export const useCurrencies = () => {
  const displayCurrencies = useMemo(() => getDisplayCurrencies(), [getDisplayCurrencies]);
  return {
    displayCurrencies
  };
};
