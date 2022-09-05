import type { ReactNode } from 'react';
import type { Web3ModalConfig } from '../hooks/useWeb3Modal';
import { createContext, useContext, useEffect } from 'react';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { useAppReducer } from './reducer';
import { useWeb3Modal } from '../hooks/useWeb3Modal';
import { allowedNetworks } from '../config';
// import { useRpcProvider } from '../hooks/useRpcProvider';
import { useAccount } from '../hooks/useAccount';

export type AppReducerType = ReturnType<typeof useAppReducer>;
export type State = AppReducerType[0];
export type Dispatch = AppReducerType[1];

export const StateContext = createContext<State | null>(null);
export const DispatchContext = createContext<Dispatch | null>(null);

export const useAppState = () => {
  const ctx = useContext(StateContext);

  if (!ctx) {
    throw new Error('Missing state context');
  }

  return ctx;
};

export const useAppDispatch = () => {
  const ctx = useContext(DispatchContext);

  if (!ctx) {
    throw new Error('Missing dispatch context');
  }

  return ctx;
};

// Web3Modal initialization
const web3ModalConfig: Web3ModalConfig = {
  cacheProvider: true,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: allowedNetworks.reduce((a, v) => ({ ...a, [v.chainId]: v.rpc }), {})
      }
    }
  }
};

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useAppReducer();
  const [provider, signIn, signOut, isWeb3ModalConnecting] =
    useWeb3Modal(web3ModalConfig);
  const [account, isAccountLoading] = useAccount(provider);

  useEffect(() => {
    dispatch({
      type: 'SET_CONNECTING',
      payload: isWeb3ModalConnecting || isAccountLoading
    });
  }, [dispatch, isWeb3ModalConnecting, isAccountLoading]);

  useEffect(() => {
    dispatch({
      type: 'SET_WEB3MODAL_SIGN_IN',
      payload: signIn
    });
  }, [dispatch, signIn]);

  useEffect(() => {
    dispatch({
      type: 'SET_WEB3MODAL_SIGN_OUT',
      payload: signOut
    });
  }, [dispatch, signOut]);

  useEffect(() => {
    dispatch({
      type: 'SET_PROVIDER',
      payload: provider
    });
  }, [dispatch, provider]);

  useEffect(() => {
    dispatch({
      type: 'SET_ACCOUNT',
      payload: account
    });
  }, [dispatch, account]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
};
