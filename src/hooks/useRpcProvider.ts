import { useState, useMemo } from 'react';
import { providers } from 'ethers';
import Logger from '../utils/logger';

const logger = Logger('useRpcProvider');

export type StaticProvider = providers.JsonRpcProvider;

export type UseRpcProviderHook = [rpcProvider: StaticProvider, error?: string];

export const useRpcProvider = (rpcUri: string): UseRpcProviderHook => {
  const [error, setError] = useState<string | undefined>();

  const rpcProvider = useMemo(() => {
    const provider = new providers.JsonRpcProvider(rpcUri);
    provider.on('error', (error) => {
      logger.error(error);
      const message = (error as Error).message || 'Unknown JsonRpcProvider error';
      setError(message);
    });
    return provider;
  }, [rpcUri]);

  return [rpcProvider, error];
};
