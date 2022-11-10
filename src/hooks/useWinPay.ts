import type { WinPay } from '@windingtree/win-pay/dist/typechain';
import { useState, useEffect } from 'react';
import { WinPay__factory } from '@windingtree/win-pay/dist/typechain';
import { Web3ModalProvider } from './useWeb3Modal';
import Logger from '../utils/logger';
import { getNetworkInfo } from '../config';
import { Chain } from '@web3modal/ethereum';
import { useSigner } from '@web3modal/react';

const logger = Logger('useWinPay');

export interface UseAssetHook {
  winPayContract: WinPay | undefined;
}

export const useWinPay = (
  provider: Web3ModalProvider | undefined,
  network: Chain | undefined
) => {
  const { data: signer, error, isLoading } = useSigner();
  const [winPayContract, setWinPayContract] = useState<WinPay | undefined>();
  useEffect(() => {
    const getContracts = async () => {
      try {
        if (signer && provider && network) {
          const chain = getNetworkInfo(network.id);
          const contract = WinPay__factory.connect(
            chain.contracts.winPay,
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
