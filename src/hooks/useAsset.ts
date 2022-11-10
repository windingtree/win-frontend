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
import Logger from '../utils/logger';
import { useNetwork, useSigner } from '@web3modal/react';

const logger = Logger('useAsset');

export interface UseAssetHook {
  assetContract: Asset | undefined;
  tokenContract: MockERC20Dec18Permit | MockWrappedERC20Dec18 | undefined;
  tokenAddress: string | undefined;
}

export const useAsset = (
  // provider: ethers.providers.Web3Provider | undefined,
  asset: CryptoAsset | undefined
) => {
  const [assetContract, setAssetContract] = useState<Asset | undefined>();
  const [tokenContract, setTokenContract] = useState<
    MockERC20Dec18Permit | MockWrappedERC20Dec18 | undefined
  >();
  const [tokenAddress, setTokenAddress] = useState<string | undefined>();
  const { data: signer, error, isLoading } = useSigner();
  const { network, isReady: isNetworkReady } = useNetwork();

  useEffect(() => {
    const getContracts = async () => {
      try {
        logger.debug('init');
        if (asset && signer && network?.chain) {
          logger.debug('provider and asset:', signer.provider, asset);
          // const signer = provider.getSigner();
          logger.debug('signer:', signer);
          logger.debug('getSigner addr:', await signer.getAddress());
          const contract = Asset__factory.connect(asset.address, signer).connect(signer);
          logger.debug('contract:', contract);
          const assetAddress = await contract.asset();
          logger.debug('Asset token address:', assetAddress);
          const isWrapped = await contract.wrapped();
          setTokenAddress(assetAddress);
          setAssetContract(contract);
          setTokenContract(
            (isWrapped ? MockERC20Dec18Permit__factory : MockWrappedERC20Dec18__factory)
              .connect(assetAddress, signer)
              .connect(signer)
          );
        } else {
          setTokenAddress(undefined);
          setAssetContract(undefined);
          setTokenContract(undefined);
        }
      } catch (err) {
        logger.error(err);
        // console.log('asassaas',err)
        setTokenAddress(undefined);
        setAssetContract(undefined);
        setTokenContract(undefined);
      }
    };
    getContracts();
  }, [signer, asset, network]);

  return {
    assetContract,
    tokenContract,
    tokenAddress
  };
};
