import { NetworkInfo } from '@windingtree/win-commons/dist/types';
import { useState, useEffect, useCallback } from 'react';
import { Select, MenuItem, FormHelperText, SelectChangeEvent } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { allowedNetworks, getNetworkInfo } from '../config';
import { useWalletRpcApi } from '../hooks/useWalletRpcApi';
import { useNetwork, useAccount } from 'wagmi';
import Logger from '../utils/logger';

const logger = Logger('NetworkSelector');

export interface NetworkSelectorProps {
  value: NetworkInfo | undefined;
  onChange: (network?: NetworkInfo) => void;
}

export const NetworkSelector = ({ value, onChange }: NetworkSelectorProps) => {
  const { chain } = useNetwork();
  const { connector } = useAccount();
  const { switchChain } = useWalletRpcApi(allowedNetworks);
  const [network, setNetwork] = useState<NetworkInfo | undefined>(value);
  const [allowedChain, setAllowedChain] = useState<boolean>(false);

  useEffect(() => {
    if (chain) {
      setAllowedChain(!!allowedNetworks.find((n) => n.chainId === chain.id));
    } else {
      setAllowedChain(false);
    }
  }, [chain]);

  useEffect(() => {
    const networkCheck = async () => {
      try {
        if (value && chain && chain.id !== value.chainId) {
          logger.debug('Reset: saved value and current chain are different');
          setNetwork(undefined);
        }
      } catch (err) {
        logger.error(err);
        setNetwork(undefined);
      }
    };
    networkCheck();
  }, [chain, value]);

  useEffect(() => {
    try {
      if (chain) {
        setNetwork(getNetworkInfo(chain.id));
      }
    } catch (err) {
      logger.error(err);
      setNetwork(undefined);
    }
  }, [chain]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onChange(network), [network]);

  const omNetworkChange = useCallback(
    async (e: SelectChangeEvent) => {
      try {
        if (connector) {
          const chainId = Number(e.target.value);

          if (chain && chainId !== chain.id) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [connector, chain]
  );

  return (
    <FormControl error={network === undefined}>
      <Select
        variant="outlined"
        value={network && allowedChain ? network.chainId.toString() : 'none'}
        onChange={omNetworkChange}
      >
        <MenuItem value="none">Select network</MenuItem>
        {allowedNetworks.map((n, index) => (
          <MenuItem key={index} value={n.chainId.toString()}>
            {n.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>
        {network === undefined ? 'Please select a supported network' : null}
      </FormHelperText>
    </FormControl>
  );
};
