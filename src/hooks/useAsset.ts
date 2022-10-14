import type {
  Asset,
  MockERC20Dec18Permit,
  MockWrappedERC20Dec18
} from '@windingtree/win-pay/dist/typechain';
import type { CryptoAsset } from '@windingtree/win-commons/dist/types';
import { useState, useEffect } from 'react';
import {
  Asset__factory,
  MockERC20Dec18Permit__factory,
  MockWrappedERC20Dec18__factory
} from '@windingtree/win-pay/dist/typechain';
import { Web3ModalProvider } from './useWeb3Modal';
import Logger from '../utils/logger';

const logger = Logger('useAsset');

export interface UseAssetHook {
  assetContract: Asset | undefined;
  tokenContract: MockERC20Dec18Permit | MockWrappedERC20Dec18 | undefined;
  tokenAddress: string | undefined;
}

export const useAsset = (
  provider: Web3ModalProvider | undefined,
  asset: CryptoAsset | undefined
) => {
  const [assetContract, setAssetContract] = useState<Asset | undefined>();
  const [tokenContract, setTokenContract] = useState<
    MockERC20Dec18Permit | MockWrappedERC20Dec18 | undefined
  >();
  const [tokenAddress, setTokenAddress] = useState<string | undefined>();

  useEffect(() => {
    const getContracts = async () => {
      try {
        if (provider && asset) {
          const contract = Asset__factory.connect(asset.address, provider).connect(
            provider.getSigner()
          );
          const assetAddress = await contract.asset();
          logger.debug('Asset token address:', assetAddress);
          const isWrapped = await contract.wrapped();
          setTokenAddress(assetAddress);
          setAssetContract(contract);
          setTokenContract(
            (isWrapped ? MockERC20Dec18Permit__factory : MockWrappedERC20Dec18__factory)
              .connect(assetAddress, provider)
              .connect(provider.getSigner())
          );
        } else {
          setTokenAddress(undefined);
          setAssetContract(undefined);
          setTokenContract(undefined);
        }
      } catch (err) {
        logger.error(err);
        setTokenAddress(undefined);
        setAssetContract(undefined);
        setTokenContract(undefined);
      }
    };
    getContracts();
  }, [provider, asset]);

  return {
    assetContract,
    tokenContract,
    tokenAddress
  };
};
