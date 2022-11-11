import type {
  BookingsAuthRequest,
  BookingsAuthResponse,
  BookingsAuthSecretResponse
} from '@windingtree/glider-types/dist/win';
import { useCallback } from 'react';
import axios from 'axios';
import { createAuthSignatureWithSigner } from '@windingtree/win-commons/dist/auth';
import { useAppDispatch } from '../store';
import { backend } from '../config';
import { Wallet } from 'ethers';
import { useNetwork, useAccount, useSigner } from 'wagmi';
import Logger from '../utils/logger';

const logger = Logger('useBookingsAuth');

export interface UseBookingsAuthHook {
  login(): Promise<void>;
  logout(): Promise<void>;
}

export const useBookingsAuth = (): UseBookingsAuthHook => {
  const dispatch = useAppDispatch();
  const { address } = useAccount();
  const { chain } = useNetwork();
  // const provider = useProvider();
  const { data: signer } = useSigner();

  const login = useCallback(async () => {
    try {
      if (!chain || !address || !signer) {
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

      const chainId = chain.id;
      const wallet = address as string;
      const signature = await createAuthSignatureWithSigner(
        chainId,
        signer as Wallet,
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
  }, [dispatch, chain, address, signer]);

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
