import type { BookingResponse } from '@windingtree/glider-types/dist/win';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useAppState } from '../store';
import { backend } from '../config';
import { usePoller } from './usePoller';
import Logger from '../utils/logger';

axios.defaults.withCredentials = true;

const logger = Logger('useBookings');

export type UseBookingsHook = BookingResponse;

export const useBookings = (): UseBookingsHook => {
  const { account, walletAuth } = useAppState();
  const [bookings, setBookings] = useState<BookingResponse>([]);

  useEffect(() => {
    if (!walletAuth) {
      setBookings([]);
    }
  }, [walletAuth]);

  const getBookings = useCallback(async () => {
    try {
      if (!account || !walletAuth) {
        setBookings([]);
        return;
      }

      const res = await axios.get<BookingResponse>(
        `${backend.url}/api/booking/${account}`,
        {
          headers: {
            Authorization: `Bearer ${walletAuth.accessToken}`
          }
        }
      );

      const bookingsResponse = res.data;

      if (!bookingsResponse) {
        throw new Error('Invalid bookings response');
      }

      setBookings(bookingsResponse);
    } catch (err) {
      logger.error(err);
      setBookings([]);
    }
  }, [account, walletAuth]);

  usePoller(getBookings, !!account && !!walletAuth, 5000, 'Bookings');

  return bookings;
};
