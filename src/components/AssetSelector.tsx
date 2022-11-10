import { CryptoAsset, NetworkInfo } from '@windingtree/win-commons/dist/types';
import { Payment } from './PaymentCard';
import { useEffect, useMemo, useState } from 'react';
import { Box, Select, MenuItem, FormHelperText, SelectChangeEvent } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { getNetworkInfo } from '../config';
import Logger from '../utils/logger';
import { Chain } from '@web3modal/ethereum';

const logger = Logger('AssetSelector');

export interface AssetSelectorProps {
  network: Chain | undefined;
  payment: Payment;
  withQuote: boolean;
  asset: CryptoAsset | undefined;
  onChange: (asset?: CryptoAsset) => void;
}

export const AssetSelector = ({
  network,
  payment,
  withQuote,
  asset: value,
  onChange
}: AssetSelectorProps) => {
  const [asset, setAsset] = useState<CryptoAsset | undefined>(
    network ? value : undefined
  );

  const chain = useMemo<NetworkInfo | undefined>(() => {
    if (!network) {
      return undefined;
    }
    return getNetworkInfo(network.id);
  }, [network, payment, withQuote]);

  const options = useMemo<CryptoAsset[]>(() => {
    if (!chain) {
      return [];
    }
    return [
      ...chain.contracts.assets.filter(
        (a) => a.currency === (withQuote ? 'USD' : payment.currency)
      )
    ];
  }, [chain, payment, withQuote]);

  const notSelected = useMemo(
    () => options.length > 0 && asset === undefined,
    [options, asset]
  );

  const noOptions = useMemo(() => options.length === 0, [options]);

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
        !chain?.contracts.assets.find(
          (a) => a.name === value.name && a.address === value.address
        ))
    ) {
      logger.debug('Reset: saved currency value not found in the network config');
      setAsset(undefined);
    }
  }, [network, value, chain]);

  const onCurrencyChange = (e: SelectChangeEvent) => {
    try {
      const option = String(e.target.value);
      const selectedAsset = options.filter((o) => o.symbol === option)[0];
      logger.debug(`Token selected ${selectedAsset.name} #${selectedAsset.address}`);
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
    <FormControl error={notSelected || noOptions}>
      <Select value={asset ? asset.symbol : 'none'} onChange={onCurrencyChange}>
        <MenuItem value="none">{!noOptions ? 'Select token' : ''}</MenuItem>
        {options.map((option, index) => (
          <MenuItem key={index} value={option.symbol}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1
              }}
            >
              <Box>{option.name}</Box>
              <Box>
                <img width={18} height={18} src={option.image} />
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Select>
      <FormHelperText sx={{ maxWidth: '120px' }}>
        {noOptions
          ? `The selected network does not support payments in ${payment.currency}`
          : notSelected
          ? 'Please select a supported token'
          : ''}
      </FormHelperText>
    </FormControl>
  );
};
