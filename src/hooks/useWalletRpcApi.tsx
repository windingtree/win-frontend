import type { NetworkInfo } from '../config';
import type { Web3ModalProvider } from './useWeb3Modal';
import { useCallback } from 'react';
import Logger from '../utils/logger';
import { utils } from 'ethers';

// Initialize logger
const logger = Logger('useRequestPermissions');

interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

export const allowedWalletPermissionsTypes: string[] = ['eth_accounts'];

export type WalletPermissionType = typeof allowedWalletPermissionsTypes[number];

export interface WalletRpcApi {
  permissions: (type: WalletPermissionType, params: unknown) => Promise<void>;
  switchChain: (chainId: number) => Promise<void>;
}

// useWalletRpcApi react hook
export const useWalletRpcApi = (
  provider: Web3ModalProvider | undefined,
  allowedNetworks: readonly NetworkInfo[]
): WalletRpcApi => {
  const permissions = useCallback(
    async (
      type: WalletPermissionType = 'eth_accounts',
      params: unknown = {}
    ) => {
      try {
        if (provider) {
          await provider.send('wallet_requestPermissions', [
            {
              [type]: params
            }
          ]);
        } else {
          throw new Error(
            'Wallet not connected yet. Cannot request permissions.'
          );
        }
      } catch (error) {
        logger.error(error);
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
        await provider.send('wallet_switchEthereumChain', [{ chainId: utils.hexlify(chainId) }]);
      } catch (e) {
        // This error code indicates that the chain has not been added to MetaMask
        if ((e as ProviderRpcError).code === 4902) {
          await provider.send('wallet_addEthereumChain', [
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
          ]);
        }
      }
    },
    [provider]
  );

  return {
    permissions,
    switchChain
  };
};
