import type { NetworkInfo, CryptoAsset } from '@windingtree/win-commons/dist/types';
import type { Payment } from './PaymentCard';
import { useEffect, useMemo, useState } from 'react';
import { Box, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Iconify from '../components/Iconify';
import { getNetworkInfo } from '../config';
import { MessageBox } from './MessageBox';
import Logger from '../utils/logger';

const logger = Logger('AssetSelector');

export interface AssetSelectorProps {
  network: NetworkInfo | undefined;
  payment: Payment;
  asset: CryptoAsset | undefined;
  onChange: (asset?: CryptoAsset) => void;
}

export const AssetSelector = ({
  network,
  payment,
  asset: value,
  onChange
}: AssetSelectorProps) => {
  const theme = useTheme();
  const [asset, setAsset] = useState<CryptoAsset | undefined>(
    network ? value : undefined
  );
  const options = useMemo<CryptoAsset[]>(() => {
    if (!network) {
      return [];
    }
    const chain = getNetworkInfo(network.chainId);
    return [...chain.contracts.assets.filter((a) => a.currency === payment.currency)];
  }, [network, payment]);
  const noOptions = useMemo(() => !!asset && options.length === 0, [options, asset]);

  useEffect(() => {
    try {
      if (value) {
        setAsset(
          options.find(
            (o) =>
              o.name === value.name &&
              o.address === value.address &&
              o.native === value.native
          )
        );
      }
    } catch (err) {
      logger.error(err);
      setAsset(undefined);
    }
  }, [value, options]);

  useEffect(() => {
    if (
      !network ||
      (value &&
        network &&
        !network.contracts.assets.find(
          (a) => a.name === value.name && a.address === value.address
        ))
    ) {
      logger.debug('Reset: saved currency value not found in the network config');
      setAsset(undefined);
    }
  }, [network, value]);

  const omCurrencyChange = (e: SelectChangeEvent) => {
    try {
      const option = String(e.target.value);
      const selectedAsset = options.filter(o => o.symbol === option)[0];
      logger.debug(`Token selected #${selectedAsset.name}`);
      setAsset(selectedAsset);
    } catch (err) {
      logger.error(err);
      setAsset(undefined);
    }
  };

  useEffect(() => onChange(asset), [asset]);

  if (!network) {
    return null;
  }

  return (
    <>
      <Select
        value={asset ? asset.symbol : 'none'}
        sx={{
          backgroundColor: !asset ? 'rgba(255,0,0,0.7)': 'transparent'
        }}
        onChange={omCurrencyChange}
      >
        <MenuItem value="none">
          <Box
            color={!asset ? 'white' : 'black'}
            sx={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {!asset &&
              <Iconify
                color="inherit"
                icon="codicon:warning"
                marginRight={theme.spacing(1)}
              />
            }
            <Box>
              Select token
            </Box>
          </Box>
        </MenuItem>
        {options.map(
          (option, index) => (
            <MenuItem
              key={index}
              value={option.symbol}
            >
              {option.name}
            </MenuItem>
          )
        )}
      </Select>
      <MessageBox type="warn" show={noOptions}>
        {`The selected network does not support payments in ${payment.currency}`}
      </MessageBox>
    </>
  );
};
