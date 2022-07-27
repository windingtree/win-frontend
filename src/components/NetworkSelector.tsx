import { useState, useMemo, useEffect } from 'react';
import { Select, Spinner } from 'grommet';
import { allowedNetworks } from '../config';
import { useAppState } from '../store';
import { useNetworkId } from '../hooks/useNetworkId';
import { useWalletRpcApi } from '../hooks/useWalletRpcApi';
import { MessageBox } from './MessageBox';

export interface Network {
  name: string;
  chainId: number;
  selected?: boolean;
}

export const createNetworkOption = (
  name: string,
  chainId: number,
  selectedId: number | undefined
): Network => ({
  name: `${name}${chainId === selectedId ? ' ✔' : ''}`,
  chainId: chainId
});

export const NetworkSelector = () => {
  const { provider } = useAppState();
  const { switchChain } = useWalletRpcApi(provider, allowedNetworks);
  const [networkId, isLoading, isRightNetwork] = useNetworkId(
    provider,
    allowedNetworks
  );
  const options = useMemo<Network[]>(
    () => allowedNetworks.map(n => createNetworkOption(n.name, n.chainId, networkId)),
    [networkId]
  );
  const [network, setNetwork] = useState<Network | undefined>();
  useEffect(
    () => {
      if (networkId) {
        const currentNetwork = allowedNetworks.find(
          n => n.chainId === networkId
        );
        if (currentNetwork) {
          setNetwork(createNetworkOption(
            currentNetwork.name,
            currentNetwork.chainId,
            networkId
          ))
        }
      } else {
        setNetwork(undefined);
      }
    },
    [networkId]
  );
  const setNetworkSelect = async (option: Network) => {
    try {
      await switchChain(option.chainId);
      setNetwork(option);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <MessageBox type="warn" show={!isRightNetwork}>
        You are connected to a wrong network. Supported networks:{' '}
        {allowedNetworks.map((n, i) => n.name + (allowedNetworks.length - 1 !== i ? ', ' : ''))}
      </MessageBox>
      <Select
        placeholder="Select network"
        labelKey="name"
        valueKey="chainId"
        options={options}
        value={network}
        onChange={({ option }) => setNetworkSelect(option)}
        icon={isLoading ? <Spinner /> : undefined}
      />
    </>
  );
};
