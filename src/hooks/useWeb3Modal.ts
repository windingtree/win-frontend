import type { IProviderControllerOptions } from 'web3modal';
import type { providers } from 'ethers';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import Web3modal from 'web3modal';
import Logger from '../utils/logger';

const logger = Logger('useWeb3Modal');

export type Web3ModalConfig = Partial<IProviderControllerOptions>;

export type Web3ModalProvider = providers.Web3Provider;

export type Web3ModalSignInFunction = () => Promise<void>;

export type Web3ModalSignOutFunction = () => void;

export type Web3ModalHook = [
  provider: undefined | Web3ModalProvider,
  signIn: Web3ModalSignInFunction,
  signOut: Web3ModalSignOutFunction,
  isConnecting: boolean,
  error?: string
];

export const useWeb3Modal = (web3ModalConfig: Web3ModalConfig): Web3ModalHook => {
  const [provider, setProvider] = useState<undefined | providers.Web3Provider>();
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<undefined | string>();

  const web3Modal = useMemo(() => new Web3modal(web3ModalConfig), [web3ModalConfig]);

  const signOut = useCallback(() => {
    web3Modal.clearCachedProvider();
    setProvider(undefined);
    logger.info(`Wallet disconnected`);
  }, [web3Modal]);

  const signIn = useCallback(async () => {
    const unhandledRejectionHandler = (event: { preventDefault: () => void; }) => {
      event.preventDefault();
      setIsConnecting(false);
      window.removeEventListener('unhandledrejection', unhandledRejectionHandler);
    };

    try {
      setError(undefined);
      setIsConnecting(true);

      // Because of bug in the web3Modal
      window.addEventListener('unhandledrejection', unhandledRejectionHandler);

      const updateProvider = async () => {
        const web3ModalProvider = await web3Modal.connect();

        web3ModalProvider.on('error', (err: Error) => {
          logger.error(err);
        });

        // Subscribe to provider events compatible with EIP-1193 standard
        // Subscribe to chainId change
        web3ModalProvider.on('chainChanged', (chainId: number) => {
          logger.info(`Chain changed: ${chainId}`);
          updateProvider();
        });

        // Subscribe to accounts change
        web3ModalProvider.on('accountsChanged', () => {
          logger.info(`Accounts changed`);
          updateProvider();
        });

        // Subscribe to provider disconnection
        web3ModalProvider.on('disconnect', (code: number, reason: string) => {
          logger.info(`Disconnected with code: ${code} and reason: ${reason}`);
          signOut();
        });

        setProvider(new ethers.providers.Web3Provider(web3ModalProvider));
        setIsConnecting(false);
        window.removeEventListener('unhandledrejection', unhandledRejectionHandler);
      };

      updateProvider();

      logger.info(`Wallet connected`);
    } catch (error) {
      setIsConnecting(false);
      window.removeEventListener('unhandledrejection', unhandledRejectionHandler);

      if (error) {
        logger.error(error);
        setError((error as Error).message);
      } else {
        logger.error('Unknown error');
      }
    }
  }, [web3Modal, signOut]);

  useEffect(() => {
    if (!provider && web3Modal.cachedProvider) {
      signIn();
    } else if (provider) {
      setTimeout(() => setIsConnecting(false), 250);
    }
  }, [provider, web3Modal, signIn]);

  return [provider, signIn, signOut, isConnecting, error];
};
