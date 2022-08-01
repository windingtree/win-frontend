import type { WinPay } from '@windingtree/win-pay/dist/typechain';
import type { NetworkInfo } from '../config';
import { useState, useEffect } from 'react';
import { WinPay__factory } from '@windingtree/win-pay/dist/typechain';
import { Web3ModalProvider } from './useWeb3Modal';
import Logger from '../utils/logger';

const logger = Logger('useWinPay');

export interface UseAssetHook {
  winPayContract: WinPay | undefined
}

export const useWinPay = (
  provider: Web3ModalProvider | undefined,
  network: NetworkInfo | undefined
) => {
  const [winPayContract, setWinPayContract] = useState<WinPay | undefined>();

  useEffect(
    () => {
      const getContracts = async () => {
        try {
          if (provider && network) {
            const contract = WinPay__factory
              .connect(network.contracts.winPay, provider)
              .connect(provider.getSigner());
            setWinPayContract(contract);
          } else {
            setWinPayContract(undefined);
          }
        } catch (err) {
          logger.error(err);
          setWinPayContract(undefined);
        }
      };
      getContracts();
    },
    [provider, network]
  );

  return {
    winPayContract
  };
};
