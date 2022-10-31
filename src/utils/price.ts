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
