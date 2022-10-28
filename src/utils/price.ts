import { PriceFormat, PriceRange } from '../hooks/useAccommodationsAndOffers';
import { isBetween } from './common';

export const checkPriceFormatsCompatible = (...prices: PriceFormat[]) => {
  let decimals: number | undefined;
  let currency: string;

  return prices.every((price) => {
    if (!currency) currency = price.currency;
    if (!decimals) decimals = price.decimals;

    return (
      price.currency === currency &&
      (price.decimals && decimals ? price.decimals === decimals : true)
    );
  });
};

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
