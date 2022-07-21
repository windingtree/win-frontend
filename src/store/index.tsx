import type { ReactNode } from 'react';
import type { Web3ModalConfig } from '../hooks/useWeb3Modal';
import { createContext, useContext, useEffect } from 'react';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { useAppReducer } from './reducer';
import { useWeb3Modal } from '../hooks/useWeb3Modal';
import config from '../config';
// import { useRpcProvider } from '../hooks/useRpcProvider';
import { useNetworkId } from '../hooks/useNetworkId';
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
}

// Web3Modal initialization
const web3ModalConfig: Web3ModalConfig = {
  cacheProvider: true,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: config.allowedNetworks.map((n) => ({[n.chainId]: n.rpc}))
          // [config.network.chainId]: config.network.rpc
      }
    }
  }
};

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useAppReducer();
  // const [
  //   networkId,
  //   isNetworkIdLoading,
  //   isRightNetwork
  // ] = useNetworkId(provider);
  // const [staticProvider] = useRpcProvider(config.network.rpc);
  const [
    provider,
    signIn,
    signOut,
    isWeb3ModalConnecting
  ] = useWeb3Modal(web3ModalConfig);
  const [
    networkId,
    isNetworkIdLoading,
    isRightNetwork
  ] = useNetworkId(provider);
  const [account, isAccountLoading] = useAccount(provider);

  useEffect(
    () => {
      dispatch({
        type: 'SET_CONNECTING',
        payload:
          isWeb3ModalConnecting ||
          isNetworkIdLoading ||
          isAccountLoading
      });
    },
    [dispatch, isWeb3ModalConnecting, isNetworkIdLoading, isAccountLoading]
  );

  useEffect(
    () => {
      dispatch({
        type: 'SET_WEB3MODAL_SIGN_IN',
        payload: signIn
      });
    },
    [dispatch, signIn]
  );

  useEffect(
    () => {
      dispatch({
        type: 'SET_WEB3MODAL_SIGN_OUT',
        payload: signOut
      });
    },
    [dispatch, signOut]
  );

  // useEffect(
  //   () => {
  //     dispatch({
  //       type: 'SET_STATIC_PROVIDER',
  //       payload: staticProvider
  //     });
  //   },
  //   [dispatch, staticProvider]
  // );

  useEffect(
    () => {
      dispatch({
        type: 'SET_PROVIDER',
        payload: provider
      });
    },
    [dispatch, provider]
  );

  useEffect(() => {
    dispatch({
      type: 'SET_IS_RIGHT_NETWORK',
      payload: isRightNetwork
    })
  }, [dispatch, isRightNetwork]);

  useEffect(() => {
    dispatch({
      type: 'SET_NETWORK_ID',
      payload: networkId
    })
  }, [dispatch, networkId]);

  useEffect(() => {
    dispatch({
      type: 'SET_ACCOUNT',
      payload: account
    })
  }, [dispatch, account]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};
