import { PriceFormat, PriceRange } from '../hooks/useAccommodationsAndOffers';
import { isBetween } from './common';

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
