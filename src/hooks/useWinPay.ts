import type { WinPay } from '@windingtree/win-pay/dist/typechain';
import type { NetworkInfo } from '@windingtree/win-commons/dist/types';
import { useState, useEffect } from 'react';
import { WinPay__factory } from '@windingtree/win-pay/dist/typechain';
import { providers } from 'ethers';
import { useSigner } from 'wagmi';
import Logger from '../utils/logger';

const logger = Logger('useWinPay');

export interface UseAssetHook {
  winPayContract: WinPay | undefined;
}

export const useWinPay = (
  provider: providers.JsonRpcProvider | undefined,
  network: NetworkInfo | undefined
) => {
  const { data: signer } = useSigner();
  const [winPayContract, setWinPayContract] = useState<WinPay | undefined>();

  useEffect(() => {
    const getContracts = async () => {
      try {
        if (provider && network && signer) {
          const contract = WinPay__factory.connect(
            network.contracts.winPay,
            provider
          ).connect(signer);
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
  }, [provider, network, signer]);

  return {
    winPayContract
  };
};
