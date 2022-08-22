import { WalletAuthResponse } from '@windingtree/glider-types/types/win'
import { useCallback } from 'react';
import axios from 'axios';
import { useAppDispatch } from '../store';
import { backend } from '../config';
import Logger from '../utils/logger';

const logger = Logger('useBookingsAuth');

export interface UseBookingsAuthHook {
  login(
    chainId: number,
    signature: string,
    wallet: string
  ): Promise<void>;
  logout(): Promise<void>;
}

export const useBookingsAuth = (): UseBookingsAuthHook => {
  const dispatch = useAppDispatch();

  const login = useCallback(
    async (
      chainId: number,
      signature: string,
      wallet: string
    ) => {
      try {
        const res = await axios.post<WalletAuthResponse>(
          `${backend.url}/wallet/auth`,
          {
            chainId,
            signature,
            wallet
          }
        );

        logger.debug('Auth response', res);

        const payload = res.data;

        if (!payload) {
          throw new Error('Invalid auth response');
        }

        dispatch({
          type: 'SET_WALLET_AUTH',
          payload
        });
      } catch (err) {
        logger.error(err);
        throw new Error(
          (err as Error).message || 'Unknown booking login error'
        );
      }
    },
    [dispatch]
  );

  const logout = useCallback(
    async () => {
      try {
        dispatch({
          type: 'SET_WALLET_AUTH'
        });
      } catch (err) {
        logger.error(err);
        throw new Error(
          (err as Error).message || 'Unknown booking logout error'
        );
      }
    },
    [dispatch]
  );

  return { login, logout };
};
