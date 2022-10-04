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
import { getTotalRoomCountReducer } from 'src/utils/offers';
import { getGroupMode } from './useAccommodationsAndOffers.tsx/helpers';

export type BookingModeType = 'group' | 'normal' | undefined;

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
    .catch((_) => {
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
    dispatch({
      type: 'SET_BOOKING_INFO',
      payload: {
        ...bookingInfo,
        ...info
      }
    });
  };

  const bookingMode = getBookingMode(bookingInfo?.offers);

  const bookGroup = useMutation<GroupBookingRequestResponse, Error>(async () => {
    if (!organizerInfo || !bookingInfo?.offers || !bookingInfo?.guestCount) {
      throw new Error(
        'Missing information to do a booking. Please try selecting your rooms again.'
      );
    }

    const { corporateInfo, ...restOrganizerInfo } = organizerInfo;
    const includeCorporateInfo = corporateInfo?.companyName !== '';

    const result = await bookGroupRequest({
      //TODO: this can be removed eventually when the BE is compatible.
      deposit: {},
      organizerInfo: {
        ...restOrganizerInfo,
        ...(includeCorporateInfo && { corporateInfo })
      },
      offers: bookingInfo.offers,
      guestCount: bookingInfo.guestCount || 0,
      invoice: bookingInfo.invoice || true
    });

    //TODO: most likely we have to save the serviceId in a state for the payment;
    return result;
  });

  return {
    bookGroup,
    bookingMode,
    organizerInfo,
    setOrganizerInfo,
    bookingInfo,
    setBookingInfo
  };
};
