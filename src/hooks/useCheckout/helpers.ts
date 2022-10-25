import { BillingAddress, OrganizerInformation } from '@windingtree/glider-types/dist/win';
import { OfferCheckoutType } from 'src/store/types';
import { getTotalRoomCountReducer } from 'src/utils/offers';
import { getGroupMode } from '../useAccommodationsAndOffers/helpers';
export type BookingModeType = 'group' | 'normal' | undefined;

/**
 * Get the id of a offer if only one offer is used for a booking.
 */
export const getOfferId = (offers: OfferCheckoutType[] | undefined) => {
  if (!offers) return;

  return offers.map(({ id }) => id)[0];
};

export const getBookingMode = (
  offers: OfferCheckoutType[] | undefined
): BookingModeType => {
  if (!offers) return undefined;

  const roomCount = offers.reduce(getTotalRoomCountReducer, 0);
  const isGroupMode = getGroupMode(roomCount);
  const bookingMode = isGroupMode ? 'group' : 'normal';
  return bookingMode;
};

/**
 * Get the address formatted for sending it the BE.
 */
export const getNormalizedAddress = (address: BillingAddress) => {
  if (!address || !address.cityName || !address.countryCode) return;
  const { cityName, countryCode, street, postalCode, ...restAddress } = address;
  const normalizedStreet = street.replace(/[^a-zA-Z0-9 ]/g, '');

  const normalizedAddress = {
    cityName: cityName.toUpperCase(),
    countryCode: countryCode.toUpperCase(),
    street: normalizedStreet.toUpperCase(),
    postalCode: postalCode?.toUpperCase(),
    ...restAddress
  };

  return normalizedAddress;
};

/**
 * Get the organizerInfo formatted for sending it the BE.
 */
export const getNormalizedOrganizerInfo = (
  organizerInfo: OrganizerInformation,
  invoice: boolean
) => {
  const { billingInfo, ...restOrganizerInfo } = organizerInfo;
  const { address, ...restBillingInfo } = billingInfo || {};
  const normalizedAddress = address && getNormalizedAddress(address);
  const includeBillingInfo = invoice && normalizedAddress;

  const normalizedOrganizerInfo = {
    ...restOrganizerInfo,
    ...(includeBillingInfo && {
      billingInfo: {
        address: normalizedAddress,
        ...restBillingInfo
      }
    })
  };

  return normalizedOrganizerInfo;
};

export const getNormalizedOffers = (offers: OfferCheckoutType[]) =>
  offers.map(({ id, quantity }) => ({
    offerId: id,
    quantity: Number(quantity)
  }));
