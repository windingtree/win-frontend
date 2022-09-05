import { NetworkInfo } from '@windingtree/win-commons/dist/types';
import { useState, useEffect, useCallback } from 'react';
import { Select, MenuItem, FormHelperText, SelectChangeEvent } from '@mui/material';
import { allowedNetworks, getNetworkInfo } from '../config';
import { useAppState } from '../store';
import { useNetworkId } from '../hooks/useNetworkId';
import { useWalletRpcApi } from '../hooks/useWalletRpcApi';
import Logger from '../utils/logger';

const logger = Logger('NetworkSelector');

export interface NetworkSelectorProps {
  value: NetworkInfo | undefined;
  onChange: (network?: NetworkInfo) => void;
}

export const NetworkSelector = ({ value, onChange }: NetworkSelectorProps) => {
  const { provider } = useAppState();
  const { switchChain } = useWalletRpcApi(provider, allowedNetworks);
  const [networkId, , isRightNetwork] = useNetworkId(provider, allowedNetworks);
  const [network, setNetwork] = useState<NetworkInfo | undefined>(value);

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
      }
    } catch (err) {
      logger.error(err);
      setNetwork(undefined);
    }
  }, [networkId]);

  useEffect(() => onChange(network), [network]);

  const omNetworkChange = useCallback(
    async (e: SelectChangeEvent) => {
      try {
        if (provider) {
          const chainId = Number(e.target.value);
          const providerNetwork = await provider.getNetwork();
          if (providerNetwork.chainId !== chainId) {
            logger.debug(`Request provider to change chain #${chainId}`);
            await switchChain(chainId);
            logger.debug(`Network switched to #${chainId}`);
          }
          setNetwork(allowedNetworks.filter((n) => n.chainId === chainId)[0]);
        }
      } catch (err) {
        logger.error(err);
      }
    },
    [provider]
  );

  return (
    <Select
      variant="outlined"
      value={network && isRightNetwork ? network.chainId.toString() : 'none'}
      onChange={omNetworkChange}
      error={network === undefined}
    >
      <MenuItem value="none">Select network</MenuItem>
      {allowedNetworks.map((n, index) => (
        <MenuItem key={index} value={n.chainId.toString()}>
          {n.name}
        </MenuItem>
      ))}
      <FormHelperText>{network === undefined ? 'Please select network' : undefined}</FormHelperText>
    </Select>
  );
};
