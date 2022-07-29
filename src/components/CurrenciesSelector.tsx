import type { NetworkInfo, CryptoAsset } from '../config';
import { useEffect, useMemo, useState } from 'react';
import { Box, Select } from 'grommet';
import { getNetworkInfo } from '../config';
import Logger from '../utils/logger';

const logger = Logger('CurrenciesSelector');

export interface CurrenciesSelectorProps {
  network: NetworkInfo | undefined;
  value: CryptoAsset | undefined;
  onChange: (asset?: CryptoAsset) => void;
}

export const CurrenciesSelector = ({
  network,
  value,
  onChange
}: CurrenciesSelectorProps) => {
  const [asset, setAsset] = useState<CryptoAsset | undefined>(
    network ? value : undefined
  );
  const options = useMemo<CryptoAsset[]>(() => {
    if (!network) {
      return [];
    }
    const chain = getNetworkInfo(network.chainId);
    return [...chain.contracts.assets];
  }, [network]);

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

  const omCurrencyChange = async (option: CryptoAsset) => {
    try {
      logger.debug(`Token selected #${option.name}`);
      setAsset(option);
    } catch (err) {
      logger.error(err);
    }
  };

  useEffect(() => onChange(asset), [asset]);

  if (!network) {
    return null;
  }

  return (
    <Box>
      <Select
        placeholder="Select token"
        labelKey="name"
        options={options}
        value={asset}
        onChange={({ option }) => omCurrencyChange(option)}
      />
    </Box>
  );
};
