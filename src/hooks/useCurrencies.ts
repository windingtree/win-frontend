import { useCallback, useEffect, useState } from 'react';
import { CurrencyResponse, Price } from '@windingtree/glider-types/dist/win';
import {
  currencySymbols,
  currencySymbolMap
} from '@windingtree/win-commons/dist/currencies';
import { stringToNumber } from '../utils/strings';
import { winBackendClientRequest } from '../utils/http';
import { useQuery } from '@tanstack/react-query';
import { CurrencyMeta } from '@windingtree/win-commons/dist/types';

export type CurrencyCode = keyof typeof currencySymbols;
export type CurrencySymbol = typeof currencySymbolMap[CurrencyCode];

export const fetchCurrencies = async () => {
  try {
    const { data } = await winBackendClientRequest<CurrencyResponse>('/currencies');
    return data;
  } catch (_) {
    throw new Error('An error occurred fetching currencies');
  }
};

export const useCurrencies = () => {
  const [currenciesAndRates, setCurrenciesAndRates] = useState<CurrencyMeta>();

  // build currencies meta
  const { data } = useQuery(['currencies'], fetchCurrencies);

  useEffect(() => {
    if (data) {
      setCurrenciesAndRates(data.currencies);
    }
  }, [data]);

  const convertCurrency = useCallback(
    (
      fromCurrency: CurrencyCode,
      toCurrency: CurrencyCode,
      amount = 1 // passing a value of 1 (default) will return a reusable multiplier for conversions
    ) => {
      if (fromCurrency === toCurrency) return { amount };

      // get currency rates
      const currencies = data;
      if (!currencies) return undefined;

      const { currencies: currencyRates } = currencies;

      // if currencies not supported return undefined
      // this means the local currency will be used
      if (!currencyRates[fromCurrency] || !currencyRates[toCurrency]) {
        return undefined;
        /* throw new Error(
          `Conversion from "${fromCurrency}" to "${toCurrency}" is not supported`
        ); */
      }

      // convert between both currencies
      const toCurrencyRate = stringToNumber(
        currencyRates[toCurrency].rateFromBaseCurrency,
        null,
        true
      );

      const fromCurrencyRate = stringToNumber(
        currencyRates[fromCurrency].rateFromBaseCurrency,
        null,
        true
      );

      // convert source to base then convert from base to target

      return {
        amount: (fromCurrencyRate / toCurrencyRate) * amount,
        decimals: currencyRates[toCurrency].decimals
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currenciesAndRates]
  );

  /**
   *
   * @param price: Price object to convert
   * @param targetCurrency: The currency you wish to convert to
   * @returns Price object with converted amounts
   */
  const convertPriceCurrency = useCallback(
    ({
      price,
      targetCurrency,
      amount
    }: {
      price: Price;
      targetCurrency: CurrencyCode;
      amount: number;
    }): Price | undefined => {
      // if conversion rate is not provided get it
      if (!targetCurrency)
        throw new Error('ConvertPriceToCurrency: You must provide a targetCurrency');

      // return price if currencies are the same
      if (targetCurrency === price.currency) return { ...price };

      const convertedCurrency = convertCurrency(
        price.currency as CurrencyCode,
        targetCurrency,
        amount
      );

      if (!convertedCurrency) return undefined;

      const { amount: conversionRate, decimals } = convertedCurrency;
      const convertAmount = (amount: string) => {
        return conversionRate ? (conversionRate * stringToNumber(amount)).toString() : '';
      };

      // convert sub-amounts
      const convertedPrice: Price = {
        currency: targetCurrency,
        public: price.public && convertAmount(price.public),
        commission: price.commission && convertAmount(price.commission),
        decimalPlaces: decimals,
        private: price.private && convertAmount(price.private),
        taxes: price.taxes && convertAmount(price.taxes),
        isAmountBeforeTax: price.isAmountBeforeTax
      };

      return convertedPrice;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currenciesAndRates]
  );

  return {
    currenciesAndRates,
    convertPriceCurrency,
    convertCurrency
  };
};
