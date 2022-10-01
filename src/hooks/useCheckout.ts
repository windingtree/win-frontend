import { useLocalStorage } from './useLocalStorage';

type BookingInfoType =
  | {
      date: {
        arrival: Date;
        departure: Date;
      };
      offers: { offerId: string; quantity: number }[];
      guestCount: number;
    }
  | undefined;

export const useCheckout = () => {
  const [personalInfo, setPersonalInfo] = useLocalStorage<string>(
    'personalInfo',
    undefined
  );
  const [bookingInfo, setBookingInfo] = useLocalStorage<BookingInfoType>(
    'bookingInfo',
    undefined
  );

  return {
    personalInfo,
    setPersonalInfo,
    bookingInfo,
    setBookingInfo
  };
};
