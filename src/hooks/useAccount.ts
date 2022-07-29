import type { Web3ModalProvider } from './useWeb3Modal';
import { useState, useEffect } from 'react';
import Logger from '../utils/logger';

const logger = Logger('useAccount');

export type UseAccountHook = [
  account: undefined | string,
  isLoading: boolean,
  error: undefined | string
];

export const useAccount = (provider?: Web3ModalProvider): UseAccountHook => {
  const [account, setAccount] = useState<undefined | string>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<undefined | string>();

  useEffect(() => {
    if (!provider) {
      return setAccount(undefined);
    }

    const getAccount = async () => {
      try {
        setLoading(true);
        setError(undefined);
        const accounts = await provider.listAccounts();
        logger.debug(`listAccounts:`, accounts);
        setAccount(accounts[0]);
        setLoading(false);
      } catch (error) {
        setLoading(false);

        if (error) {
          logger.error(error);
          setError((error as Error).message);
        } else {
          logger.error('Unknown error');
        }
      }
    };

    getAccount();
  }, [provider]);

  return [account, isLoading, error];
};
