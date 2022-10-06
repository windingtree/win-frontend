import { useMutation } from '@tanstack/react-query';
import {
  GroupBookingRequest,
  GroupBookingRequestResponse,
  OfferIdAndQuantity,
  OrganizerInformation
} from '@windingtree/glider-types/dist/win';
import axios from 'axios';
import { backend } from 'src/config';
import { useAppDispatch, useAppState } from 'src/store';
import { BookingInfoType } from 'src/store/types';
import Logger from 'src/utils/logger';
import { getTotalRoomCountReducer } from 'src/utils/offers';
import { getGroupMode } from './useAccommodationsAndOffers.tsx/helpers';

const logger = Logger('useCheckout');

export type BookingModeType = 'group' | 'normal' | undefined;

/**
 * Get the id of a offer if only one offer is used for a booking.
 */
export const getOfferById = (offers: OfferIdAndQuantity[] | undefined) => {
  if (!offers) return;

  return offers.map(({ offerId }) => offerId)[0];
};

const getBookingMode = (offers: OfferIdAndQuantity[] | undefined): BookingModeType => {
  if (!offers) return undefined;

  const roomCount = offers.reduce(getTotalRoomCountReducer, 0);
  const isGroupMode = getGroupMode(roomCount);
  const bookingMode = isGroupMode ? 'group' : 'normal';
  return bookingMode;
};

const bookGroupRequest = async (mutationProps: GroupBookingRequest) => {
  const { data } = await axios
    .post<GroupBookingRequestResponse>(
      `${backend.url}/api/groups/bookingRequest`,
      mutationProps,
      {
        withCredentials: true
      }
    )
    .catch((e) => {
      //eslint-disable-next-line
      logger.error(e);
      throw new Error('Something went wrong with your booking. Please try again.');
    });

  if (!data.depositOptions || !data.requestId) {
    throw new Error('Something went wrong with your booking. Please try again.');
  }

  return data;
};

/**
 * This hook is currently only compatible for group bookings, not normal bookings.
 */
export const useCheckout = () => {
  const dispatch = useAppDispatch();
  const { organizerInfo, bookingInfo } = useAppState();

  const setOrganizerInfo = (info: OrganizerInformation) => {
    dispatch({
      type: 'SET_ORGANIZER_INFO',
      payload: info
    });
  };

  const setBookingInfo = (info: BookingInfoType) => {
    const roomCount = info?.offers?.reduce(getTotalRoomCountReducer, 0);

    dispatch({
      type: 'SET_BOOKING_INFO',
      payload: {
        ...bookingInfo,
        ...info,
        ...(roomCount && { roomCount })
      }
    });
  };

  const bookGroup = useMutation<GroupBookingRequestResponse, Error>(async () => {
    if (!organizerInfo || !bookingInfo?.offers || !bookingInfo?.adultCount) {
      throw new Error('Something went wrong. Please try selecting your rooms again.');
    }
    const { corporateInfo, ...restOrganizerInfo } = organizerInfo;
    const includeCorporateInfo = corporateInfo?.companyName !== '';

    const result = await bookGroupRequest({
      organizerInfo: {
        ...restOrganizerInfo,
        ...(includeCorporateInfo && { corporateInfo })
      },
      offers: bookingInfo.offers,
      guestCount: bookingInfo.adultCount,
      invoice: bookingInfo.invoice ?? false
    });

    const { depositOptions, serviceId, providerId } = result;

    setBookingInfo({ depositOptions, serviceId, providerId });
    return result;
  });

  return {
    bookGroup,
    bookingMode: getBookingMode(bookingInfo?.offers),
    organizerInfo,
    setOrganizerInfo,
    bookingInfo,
    setBookingInfo
  };
};
