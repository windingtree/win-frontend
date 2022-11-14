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
import { providers } from 'ethers';
import { useSigner } from 'wagmi';
import Logger from '../utils/logger';

const logger = Logger('useAsset');

export interface UseAssetHook {
  assetContract: Asset | undefined;
  tokenContract: MockERC20Dec18Permit | MockWrappedERC20Dec18 | undefined;
  tokenAddress: string | undefined;
}

export const useAsset = (
  provider: providers.JsonRpcProvider | undefined,
  asset: CryptoAsset | undefined
) => {
  const { data: signer } = useSigner();
  const [assetContract, setAssetContract] = useState<Asset | undefined>();
  const [tokenContract, setTokenContract] = useState<
    MockERC20Dec18Permit | MockWrappedERC20Dec18 | undefined
  >();
  const [tokenAddress, setTokenAddress] = useState<string | undefined>();

  useEffect(() => {
    const getContracts = async () => {
      try {
        if (provider && asset && signer) {
          const contract = Asset__factory.connect(asset.address, provider).connect(
            signer
          );
          const assetAddress = await contract.asset();
          logger.debug('Asset token address:', assetAddress);
          const isWrapped = await contract.wrapped();
          setTokenAddress(assetAddress);
          setAssetContract(contract);
          setTokenContract(
            (isWrapped ? MockERC20Dec18Permit__factory : MockWrappedERC20Dec18__factory)
              .connect(assetAddress, provider)
              .connect(signer)
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
  }, [provider, asset, signer]);

  return {
    assetContract,
    tokenContract,
    tokenAddress
  };
};
