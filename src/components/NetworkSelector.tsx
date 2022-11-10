import { useCallback, useEffect, useState } from 'react';
import { Select, MenuItem, FormHelperText, SelectChangeEvent } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { allowedNetworks } from '../config';
import Logger from '../utils/logger';
import { ethers } from 'ethers';

const logger = Logger('NetworkSelector');

export interface NetworkSelectorProps {
  value: number | undefined;
  onChange: ({ chainId }: { chainId: number }) => void;
  provider: ethers.providers.Web3Provider;
}

export const NetworkSelector = ({ value, onChange, provider }: NetworkSelectorProps) => {
  const [network, setNetwork] = useState<number | undefined>(value);

  useEffect(() => {
    const networkCheck = async () => {
      try {
        if (value && provider) {
          const providerNetwork = await provider.getNetwork();
          if (providerNetwork.chainId !== value) {
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
      if (network) {
        setNetwork(network);
        onChange({ chainId: network });
      }
    } catch (err) {
      logger.error(err);
      setNetwork(undefined);
    }
  }, [network]);

  // useEffect(() => {
  //   if (network) {
  //     onChange({ chainId: network })
  //   }
  // }, [network]);

  const onNetworkChange = useCallback(
    async (e: SelectChangeEvent) => {
      try {
        if (provider) {
          const chainId = Number(e.target.value);
          const providerNetwork = await provider.getNetwork();
          if (providerNetwork.chainId !== chainId) {
            logger.debug(`Request provider to change chain #${chainId}`);
            // await switchChain(chainId);
            setNetwork(allowedNetworks.find((n) => n.chainId === chainId)?.chainId);
            logger.debug(`Network switched to #${chainId}`);
          }
        }
      } catch (err) {
        logger.error(err);
      }
    },
    [provider]
  );

  return (
    <FormControl error={value === undefined}>
      <Select
        variant="outlined"
        value={value ? value.toString() : 'none'}
        onChange={onNetworkChange}
      >
        <MenuItem value="none">Select network</MenuItem>
        {allowedNetworks.map((n, index) => (
          <MenuItem key={index} value={n.chainId.toString()}>
            {n.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>
        {value === undefined ? 'Please select a supported network' : null}
      </FormHelperText>
    </FormControl>
  );
};
