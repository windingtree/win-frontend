import { RefundabilityPolicy, RoomTypes } from '@windingtree/glider-types/dist/win';
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

export const getRoomOfOffer = (
  roomTypes: Record<string, RoomTypes>,
  offer: OfferRecord
): RoomTypes => {
  const accommodationOfOffer = Object.values(offer.pricePlansReferences)[0];
  // console.log('WADDUP', accommodationOfOffer);

  const roomId: string = accommodationOfOffer?.roomType || '';

  const matchedRoomWithOffer = roomTypes[roomId];

  // console.log('matched', matchedRoomWithOffer);
  return matchedRoomWithOffer;
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
