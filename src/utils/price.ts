import { Price } from '@windingtree/glider-types/dist/win';
import { isBetween } from './common';
import currencyCodes from 'currency-codes';
import { currencySymbolMap } from '@windingtree/win-commons/dist/currencies';
import { stringToNumber } from './strings';
import { PriceFormat, PriceRange } from 'src/hooks/useAccommodationMultiple';

// used to check 2 price formats if they are the same and can be used for comparison
export const checkPriceFormatsCompatible = (...prices: PriceFormat[]) => {
  let decimals: number | undefined;
  let currency: string;

  return prices.every((price) => {
    if (!price) return false;
    if (!currency) currency = price.currency;
    if (!decimals) decimals = price.decimals;

    return (
      price.currency === currency &&
      (price.decimals && decimals ? price.decimals === decimals : true)
    );
  });
};

// check if a price range is included in another given price range
export const isPriceRangeWithinPriceRange = (
  priceRange: PriceRange,
  checkWithinPriceRange: PriceRange,
  checkLowestPriceOnly = true
) => {
  // always ensure prices have same currency/decimals
  const pricesCompatible = checkPriceFormatsCompatible(
    priceRange.lowestPrice,
    priceRange.highestPrice,
    checkWithinPriceRange.lowestPrice,
    checkWithinPriceRange.highestPrice
  );
  if (!pricesCompatible) return false;

  const isWithin =
    isBetween(
      priceRange.lowestPrice.price,
      checkWithinPriceRange.lowestPrice.price,
      checkWithinPriceRange.highestPrice.price
    ) &&
    (checkLowestPriceOnly ||
      isBetween(
        priceRange.highestPrice.price,
        checkWithinPriceRange.lowestPrice.price,
        checkWithinPriceRange.highestPrice.price
      ));

  return isWithin;
};

export const getPriceRangeFromPriceRanges = (
  priceRanges: PriceRange[],
  currency: string,
  fromLowestOrHighest: 'lowestPrices' | 'highestPrices'
): PriceRange | undefined => {
  let lowest: PriceRange | null = null,
    highest: PriceRange | null = null;
  priceRanges.forEach((priceRange) => {
    if (
      priceRange.lowestPrice.currency !== currency ||
      priceRange.highestPrice.currency !== currency
    )
      return;

    if (fromLowestOrHighest === 'lowestPrices') {
      if (lowest) {
        lowest =
          priceRange.lowestPrice.price > lowest.lowestPrice.price ? lowest : priceRange;
      } else {
        lowest = priceRange;
      }
      if (highest) {
        highest =
          priceRange.lowestPrice.price < highest.lowestPrice.price ? highest : priceRange;
      } else {
        highest = priceRange;
      }
    } else if (fromLowestOrHighest === 'highestPrices') {
      if (lowest) {
        lowest =
          priceRange.highestPrice.price > lowest.highestPrice.price ? lowest : priceRange;
      } else {
        lowest = priceRange;
      }
      if (highest) {
        highest =
          priceRange.highestPrice.price < highest.highestPrice.price
            ? highest
            : priceRange;
      } else {
        highest = priceRange;
      }
    }
  });

  if (!lowest || !highest) {
    return undefined;
  }

  return {
    highestPrice:
      fromLowestOrHighest === 'lowestPrices'
        ? (highest as PriceRange).lowestPrice
        : (highest as PriceRange).highestPrice,
    lowestPrice:
      fromLowestOrHighest === 'lowestPrices'
        ? (lowest as PriceRange).lowestPrice
        : (lowest as PriceRange).highestPrice
  };
};

export const displayPriceFromPrice = (price: Price): string => {
  const { currency, decimalPlaces, public: value } = price;
  return displayPriceFromValues(value, currency, decimalPlaces);
};

export const displayPriceFromPriceFormat = (
  priceFormat: PriceFormat | undefined
): string => {
  if (!priceFormat) return '';
  const { currency, price, decimals } = priceFormat;
  return displayPriceFromValues(price, currency, decimals);
};

export const displayPriceFromValues = (
  price: number | string | undefined,
  currency: string | undefined,
  decimalPlaces?: number | undefined
): string => {
  // ideally this should have already been provided
  if (!currency) return '';
  const decimals = decimalPlaces ?? currencyCodes.code(currency)?.digits;
  const currencySymbol = currencySymbolMap[currency];
  if (price === undefined) return '';

  const numValue =
    typeof price === 'number' ? price : stringToNumber(price, undefined, false);
  if (numValue === undefined) return '';

  return `${currencySymbol} ${
    decimals !== undefined ? `${numValue.toFixed(decimals)}` : `${numValue}`
  }`;
};
