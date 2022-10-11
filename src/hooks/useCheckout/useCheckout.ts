import { useMutation } from '@tanstack/react-query';
import {
  GroupBookingRequestResponse,
  OrganizerInformation,
  Quote
} from '@windingtree/glider-types/dist/win';
import { useAppDispatch, useAppState } from 'src/store';
import { BookingInfoType } from 'src/store/types';
import { getTotalRoomCountReducer } from 'src/utils/offers';
import { bookGroupRequest } from './api';
import { getBookingMode } from './helpers';

export const useCheckout = () => {
  const dispatch = useAppDispatch();
  const { organizerInfo, bookingInfo } = useAppState();

  /**
   * Save the organizer info in global state
   * @param info : info of the organizer
   */
  const setOrganizerInfo = (info: OrganizerInformation) => {
    dispatch({
      type: 'SET_ORGANIZER_INFO',
      payload: info
    });
  };

  /**
   * Save the booking info in global state
   * @param info : info of a booking
   * @param cleanPrevState : overwrite existing state with new state (TRUE), or spread the new state over the existing storage (FALSE).
   */
  const setBookingInfo = (info: BookingInfoType, cleanPrevState = false) => {
    const roomCount = info?.offers?.reduce(getTotalRoomCountReducer, 0);

    const newStore = {
      ...info,
      ...(roomCount && { roomCount })
    };

    dispatch({
      type: 'SET_BOOKING_INFO',
      payload: cleanPrevState ? newStore : { ...bookingInfo, ...newStore }
    });
  };

  /**
   * Send a mutation in order to register the group booking,
   * and get necessary information to pay for the deposit.
   */
  const bookGroup = useMutation<GroupBookingRequestResponse, Error>(async () => {
    if (!organizerInfo || !bookingInfo?.offers || !bookingInfo?.adultCount) {
      throw new Error('Something went wrong. Please try selecting your rooms again.');
    }
    const { billingInfo, ...restOrganizerInfo } = organizerInfo;
    const includeBillingInfo = bookingInfo?.invoice;

    console.log(bookingInfo.invoice, billingInfo);

    const result = await bookGroupRequest({
      organizerInfo: {
        ...restOrganizerInfo,
        ...(includeBillingInfo && { billingInfo })
      },
      offers: bookingInfo.offers,
      guestCount: bookingInfo.adultCount,
      invoice: bookingInfo.invoice ?? false
    });

    const { depositOptions, serviceId, providerId } = result;

    // TODO: This needs to be revisited for the story to convert to different currencies
    const quote: Quote = {
      quoteId: 'dummy',
      sourceCurrency: 'USD',
      sourceAmount: depositOptions.usd || 'dummy',
      targetCurrency: 'dummy',
      targetAmount: 'dummy',
      rate: 'dummy'
    };

    setBookingInfo({ quote, pricing: depositOptions, serviceId, providerId });
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
