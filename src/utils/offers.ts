import {
  Offer,
  RefundabilityPolicy,
  WinAccommodation
} from '@windingtree/glider-types/dist/win';
import { OfferCheckoutType } from 'src/containers/facility/FacilityOffers/FacilityOffersSelectMultiple';
import { OfferRecord } from 'src/store/types';
import { PriceFormat, PriceRange } from '../hooks/useAccommodationsAndOffers';
import { isBetween } from './common';
import { checkPriceFormatsCompatible } from './price';
import { stringToNumber } from './strings';

export const getTotalRoomCountReducer = (
  prev: number,
  current: OfferCheckoutType | OfferCheckoutType
): number => Number(current.quantity) + prev;

export const getIsRefundable = (
  refundableType: RefundabilityPolicy['type'] | undefined
) => {
  if (refundableType === 'refundable_with_deadline') return true;
  false;
};

export const filterOffersByPriceRanges = (
  offers: OfferRecord[],
  ...priceRange: PriceRange[]
) => {
  if (!priceRange.length) return offers;
  return offers.filter((offer) => {
    const offerPrice = offer.preferredCurrencyPrice ?? offer.price;

    // format price
    const price: PriceFormat = {
      currency: offerPrice.currency,
      price: stringToNumber(offerPrice.public, undefined, false)
    };

    // return only offers that have similar currency and within price range
    return priceRange.some((prices) => {
      const pricesCompatible = checkPriceFormatsCompatible(
        price,
        prices.lowestPrice,
        prices.highestPrice
      );
      if (!pricesCompatible) return false;
      return isBetween(price.price, prices.lowestPrice.price, prices.highestPrice.price);
    });
  });
};

export const sortOffersByPrice = (offers: OfferRecord[]): OfferRecord[] => {
  return offers.sort((prevOffer, nextOffer) => {
    return Number(prevOffer.price.public) - Number(nextOffer.price.public);
  });
};

export const getAccommodationOfOffer = (offer: Offer | OfferRecord) => {
  return Object.values(offer.pricePlansReferences)[0];
};

export const getOffersWithRoomInfo = (
  offers: OfferRecord[],
  accommodations: Record<string, WinAccommodation> | undefined
) =>
  offers.map((offer): OfferRecord => {
    if (!accommodations) return offer;

    const accommodationId = getAccommodationOfOffer(offer).accommodation;
    const roomTypeId = getAccommodationOfOffer(offer).roomType;
    const matchedAccommodation = accommodations[accommodationId];
    const roomType = matchedAccommodation.roomTypes[roomTypeId];

    return {
      room: roomType,
      ...offer
    };
  });
