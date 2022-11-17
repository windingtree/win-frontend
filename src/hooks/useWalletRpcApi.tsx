import type { NetworkInfo } from '@windingtree/win-commons/dist/types';
import { useCallback } from 'react';
import Logger from '../utils/logger';
import { useAccount } from 'wagmi';

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
  watchAsset: (options: WatchAssetOptions) => Promise<void>;
  permissions: (type: WalletPermissionType, params: unknown) => Promise<void>;
  switchChain: (chainId: number) => Promise<void>;
}

// useWalletRpcApi react hook
export const useWalletRpcApi = (
  allowedNetworks: readonly NetworkInfo[]
): WalletRpcApi => {
  const { connector } = useAccount();

  const watchAsset = useCallback(
    async (options: WatchAssetOptions) => {
      try {
        if (connector && connector.watchAsset) {
          logger.debug('wallet_watchAsset', options);
          await connector.watchAsset(options);
        }
      } catch (e) {
        logger.debug('wallet_watchAsset failure', e);
      }
    },
    [connector]
  );

  const permissions = useCallback(
    async (type: WalletPermissionType = 'eth_accounts', params: unknown = {}) => {
      try {
        if (connector && connector.id === 'metaMask') {
          const provider = await connector.getProvider();

          if (provider) {
            const request = [
              {
                [type]: params
              }
            ];
            logger.debug('wallet_requestPermissions', request);
            await provider.request({
              method: 'wallet_requestPermissions',
              params: request
            });
          }
        }
      } catch (e) {
        logger.debug('wallet_requestPermissions failure', e);
      }
    },
    [connector]
  );

  const switchChain = useCallback(
    async (chainId: number) => {
      try {
        if (connector && connector.switchChain) {
          const targetChain = allowedNetworks.find((n) => n.chainId === chainId);

          if (!targetChain) {
            throw new Error(`Unsupported chainId #${chainId}`);
          }

          logger.debug('wallet_switchEthereumChain', chainId);
          await connector.switchChain(chainId);
        }
      } catch (e) {
        logger.debug('wallet_switchEthereumChain failure', e);
      }
    },
    [allowedNetworks, connector]
  );

  return {
    watchAsset,
    permissions,
    switchChain
  };
};
