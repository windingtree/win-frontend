import type { NetworkInfo } from '@windingtree/win-commons/dist/types';
import { useNetwork } from 'wagmi';
import { useState, useEffect } from 'react';
import Logger from '../utils/logger';

const logger = Logger('useNetworkId');

export type NetworkIdHook = [
  networkId: undefined | number,
  isLoading: boolean,
  isRightNetwork: boolean,
  error: undefined | string
];

// useNetworkId react hook
export const useNetworkId = (allowedNetworks: readonly NetworkInfo[]): NetworkIdHook => {
  const { chain } = useNetwork();
  const [networkId, setNetworkId] = useState<undefined | number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRightNetwork, setIsRightNetwork] = useState<boolean>(true);
  const [error, setError] = useState<undefined | string>();

  useEffect(() => {
    setError(undefined);

    if (!chain) {
      return setNetworkId(undefined);
    }

    const getNetworkId = async () => {
      try {
        setIsLoading(true);
        setIsLoading(false);
        logger.debug('chain:', chain);

        if (chain) {
          const allowed = allowedNetworks.find((n) => n.chainId === chain.id);
          if (allowed) {
            setNetworkId(chain.id);
            setIsRightNetwork(true);
          } else {
            throw new Error(
              `Invalid network ${chain.id} though expected ${allowedNetworks.map(
                (n) => n.name + ' '
              )}`
            );
          }
        } else {
          setNetworkId(undefined);
          setIsRightNetwork(false);
        }
      } catch (error) {
        setIsLoading(false);
        setNetworkId(undefined);
        setIsRightNetwork(false);

        if (error) {
          logger.error(error);
          setError((error as Error).message);
        } else {
          logger.error('Unknown error');
        }
      }
    };

    getNetworkId();
  }, [chain, allowedNetworks]);

  return [networkId, isLoading, isRightNetwork, error];
};
