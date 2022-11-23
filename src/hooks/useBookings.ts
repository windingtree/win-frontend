import type { BookingResponse } from '@windingtree/glider-types/dist/win';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useAppState } from '../store';
import { backend } from '../config';
import { usePoller } from './usePoller';
import Logger from '../utils/logger';
import { useAccount } from 'wagmi';

const logger = Logger('useBookings');

export type UseBookingsHook = BookingResponse;

export const useBookings = (): UseBookingsHook => {
  const { walletAuth } = useAppState();
  const { address } = useAccount();
  const [bookings, setBookings] = useState<BookingResponse>([]);

  useEffect(() => {
    if (!walletAuth) {
      setBookings([]);
    }
  }, [walletAuth]);

  const getBookings = useCallback(async () => {
    try {
      if (!address || !walletAuth) {
        setBookings([]);
        return;
      }

      const res = await axios.get<BookingResponse>(
        `${backend.url}/api/booking/${address}`,
        {
          headers: {
            Authorization: `Bearer ${walletAuth.accessToken}`
          },
          withCredentials: true
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
  }, [address, walletAuth]);

  usePoller(getBookings, !!address && !!walletAuth, 5000, 'Bookings');

  return bookings;
};
