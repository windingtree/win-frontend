import type {
  BookingsAuthRequest,
  BookingsAuthResponse,
  BookingsAuthSecretResponse
} from '@windingtree/glider-types/dist/win';
import { useCallback } from 'react';
import axios from 'axios';
import { createAuthSignature } from '@windingtree/win-commons/dist/auth';
import { useAppDispatch } from '../store';
import { backend } from '../config';
import Logger from '../utils/logger';
import { useProvider, useAccount, useNetwork } from '@web3modal/react';
import { ethers } from 'ethers';

const logger = Logger('useBookingsAuth');

export interface UseBookingsAuthHook {
  login(): Promise<void>;
  logout(): Promise<void>;
}

export const useBookingsAuth = (): UseBookingsAuthHook => {
  const dispatch = useAppDispatch();

  const { provider, isReady: isProviderReady } = useProvider();
  const { account, isReady: isAccountReady } = useAccount();
  const { network, isReady: isNetworkReady } = useNetwork();

  const login = useCallback(async () => {
    try {
      if (
        !account.isConnected ||
        !isProviderReady ||
        !isAccountReady ||
        !isNetworkReady ||
        provider === undefined
      ) {
        throw new Error('Wallet not connected yet');
      }

      const secretRes = await axios.get<BookingsAuthSecretResponse>(
        `${backend.url}/api/bookings/auth/secret`
      );

      logger.debug('Auth secret', secretRes);

      const secret = secretRes.data.secret;

      if (!secret) {
        throw new Error('Invalid auth secret');
      }

      const chainId = network?.chain?.id;
      const wallet = account.address;
      const signature = await createAuthSignature(
        provider as unknown as ethers.providers.Web3Provider,
        secret
      );

      const authRes = await axios.post<BookingsAuthResponse>(
        `${backend.url}/api/bookings/auth`,
        {
          chainId,
          signature,
          secret,
          wallet
        } as BookingsAuthRequest,
        {
          withCredentials: true
        }
      );

      logger.debug('Auth response', authRes);

      const payload = authRes.data;

      if (!payload) {
        throw new Error('Invalid auth response');
      }

      dispatch({
        type: 'SET_WALLET_AUTH',
        payload
      });
    } catch (err) {
      logger.error(err);
      throw new Error((err as Error).message || 'Unknown booking login error');
    }
  }, [dispatch, account, provider]);

  const logout = useCallback(async () => {
    try {
      dispatch({
        type: 'SET_WALLET_AUTH'
      });
    } catch (err) {
      logger.error(err);
      throw new Error((err as Error).message || 'Unknown booking logout error');
    }
  }, [dispatch]);

  return { login, logout };
};
