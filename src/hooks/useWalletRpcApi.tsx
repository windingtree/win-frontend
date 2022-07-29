import type { NetworkInfo } from '../config';
import type { Web3ModalProvider } from './useWeb3Modal';
import { useCallback } from 'react';
import Logger from '../utils/logger';
import { utils } from 'ethers';

const logger = Logger('useRequestPermissions');

export interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

export interface WatchAssetOptions {
  address: string;
  symbol: string;
  decimals: number;
  image: string;
}

export const allowedWalletPermissionsTypes: string[] = ['eth_accounts'];

export type WalletPermissionType = typeof allowedWalletPermissionsTypes[number];

export interface WalletRpcApi {
  watchAsset: (type: string, options: WatchAssetOptions) => Promise<void>;
  permissions: (type: WalletPermissionType, params: unknown) => Promise<void>;
  switchChain: (chainId: number) => Promise<void>;
}

// useWalletRpcApi react hook
export const useWalletRpcApi = (
  provider: Web3ModalProvider | undefined,
  allowedNetworks: readonly NetworkInfo[]
): WalletRpcApi => {
  const watchAsset = useCallback(
    async (type: string, options: WatchAssetOptions) => {
      if (provider) {
        const request = {
          type,
          options
        } as never;
        logger.debug('wallet_watchAsset', request);
        const added = await provider.send('wallet_watchAsset', request);
        if (!added) {
          throw new Error('Unable to register the token in your wallet');
        }
      } else {
        throw new Error('Wallet not connected yet. Cannot add asset.');
      }
    },
    [provider]
  );

  const permissions = useCallback(
    async (type: WalletPermissionType = 'eth_accounts', params: unknown = {}) => {
      if (provider) {
        const request = [
          {
            [type]: params
          }
        ];
        logger.debug('wallet_requestPermissions', request);
        await provider.send('wallet_requestPermissions', request);
      } else {
        throw new Error('Wallet not connected yet. Cannot request permissions.');
      }
    },
    [provider]
  );

  const switchChain = useCallback(
    async (chainId: number) => {
      if (provider === undefined) {
        return;
      }

      const targetChain = allowedNetworks.find((n) => n.chainId === chainId);

      if (!targetChain) {
        throw new Error(`Unsupported chainId #${chainId}`);
      }

      try {
        const switchRequest = [
          {
            chainId: utils.hexlify(chainId)
          }
        ];
        logger.debug('wallet_switchEthereumChain', switchRequest);
        await provider.send('wallet_switchEthereumChain', switchRequest);
      } catch (e) {
        // This error code indicates that the chain has not been added to MetaMask
        if ((e as ProviderRpcError).code === 4902) {
          const addRequest = [
            {
              chainName: targetChain.name,
              chainId: utils.hexlify(targetChain.chainId),
              nativeCurrency: {
                name: targetChain.currency,
                decimals: targetChain.decimals,
                symbol: targetChain.currency
              },
              rpcUrls: [targetChain.rpc]
            }
          ];
          logger.debug('wallet_addEthereumChain', addRequest);
          await provider.send('wallet_addEthereumChain', addRequest);
        }
      }
    },
    [provider]
  );

  return {
    watchAsset,
    permissions,
    switchChain
  };
};
