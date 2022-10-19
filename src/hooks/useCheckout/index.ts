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
import {
  getBookingMode,
  getNormalizedOffers,
  getNormalizedOrganizerInfo
} from './helpers';

type OptionalQuote = Quote | undefined;

export const useCheckout = () => {
  const dispatch = useAppDispatch();
  const { organizerInfo, bookingInfo } = useAppState();

  /**
   * Save the organizer info in global state
   * @param info : info of the organizer
   */
  const setOrganizerInfo = (info: OrganizerInformation | undefined) => {
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

    const newState = {
      ...info,
      ...(roomCount && { roomCount })
    };

    dispatch({
      type: 'SET_BOOKING_INFO',
      payload: cleanPrevState ? newState : { ...bookingInfo, ...newState }
    });
  };

  /**
   * Send a mutation in order to register the group booking,
   * and get necessary information to pay for the deposit.
   */
  const bookGroup = useMutation<GroupBookingRequestResponse, Error>(async () => {
    if (
      !organizerInfo ||
      !bookingInfo?.offers ||
      !bookingInfo?.adultCount ||
      typeof bookingInfo?.invoice != 'boolean'
    ) {
      throw new Error('Something went wrong. Please try selecting your rooms again.');
    }

    const normalizedOrganizerInfo = getNormalizedOrganizerInfo(
      organizerInfo,
      bookingInfo.invoice
    );

    const normalizedOffers = getNormalizedOffers(bookingInfo.offers);

    const result = await bookGroupRequest({
      organizerInfo: normalizedOrganizerInfo,
      offers: normalizedOffers,
      guestCount: bookingInfo.adultCount,
      invoice: bookingInfo.invoice
    });

    const { depositOptions, serviceId, providerId } = result;

    // TODO: We currently only get from the BE the Quote for a normal booking, not a group booking
    // for now we create a Quote object ourselves for the group booking, but this eventually has to be refactored.
    const quote: OptionalQuote = depositOptions.usd
      ? {
          quoteId: '',
          sourceCurrency: 'USD',
          sourceAmount: depositOptions.usd,
          targetCurrency: depositOptions.offerCurrency.currency,
          targetAmount: depositOptions.offerCurrency.amount,
          rate: ''
        }
      : undefined;

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
