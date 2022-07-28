import type { NetworkInfo } from '../config';
import { useState, useEffect, useCallback } from 'react';
import { Box, Select, Spinner } from 'grommet';
import { allowedNetworks, getNetworkInfo } from '../config';
import { useAppState } from '../store';
import { useNetworkId } from '../hooks/useNetworkId';
import { useWalletRpcApi } from '../hooks/useWalletRpcApi';
import { MessageBox } from './MessageBox';
import Logger from '../utils/logger';

const logger = Logger('NetworkSelector');

export interface NetworkSelectorProps {
  value: NetworkInfo | undefined;
  onChange: (network?: NetworkInfo) => void;
}

export const NetworkSelector = ({ value, onChange }: NetworkSelectorProps) => {
  const { provider } = useAppState();
  const { switchChain } = useWalletRpcApi(provider, allowedNetworks);
  const [networkId, isLoading, isRightNetwork] = useNetworkId(provider, allowedNetworks);
  const [network, setNetwork] = useState<NetworkInfo | undefined>(value);
  const options = [...allowedNetworks];

  useEffect(() => {
    const networkCheck = async () => {
      try {
        if (value && provider) {
          const providerNetwork = await provider.getNetwork();
          if (providerNetwork.chainId !== value.chainId) {
            logger.debug('Reset: saved value and current chain are different');
            setNetwork(undefined);
          }
        }
      } catch (err) {
        logger.error(err);
        setNetwork(undefined);
      }
    };
    networkCheck();
  }, [provider, value]);

  useEffect(() => {
    try {
      if (networkId) {
        setNetwork(getNetworkInfo(networkId));
      } else {
        setNetwork(undefined);
      }
    } catch (err) {
      logger.error(err);
      setNetwork(undefined);
    }
  }, [networkId]);

  useEffect(() => onChange(network), [network]);

  const omNetworkChange = useCallback(
    async (option: NetworkInfo) => {
      try {
        if (provider) {
          const providerNetwork = await provider.getNetwork();
          if (providerNetwork.chainId !== option.chainId) {
            logger.debug(`Request provider to change chain #${option.chainId}`);
            await switchChain(option.chainId);
            logger.debug(`Network switched to #${option.chainId}`);
            setNetwork(option);
          } else {
            setNetwork(option);
          }
        }
      } catch (err) {
        logger.error(err);
      }
    },
    [provider]
  );

  return (
    <Box>
      <MessageBox type="warn" show={!isRightNetwork}>
        You are connected to a wrong network. Supported networks:{' '}
        {options.map((n, i) => n.name + (options.length - 1 !== i ? ', ' : ''))}
      </MessageBox>
      <Select
        placeholder="Select network"
        labelKey="name"
        valueKey="chainId"
        options={options}
        value={network}
        onChange={({ option }) => omNetworkChange(option)}
        icon={isLoading ? <Spinner /> : undefined}
      />
    </Box>
  );
};
