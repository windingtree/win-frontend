import type { NetworkInfo, CryptoAsset } from '../config';
import type { Payment } from './PaymentCard';
import { useEffect, useMemo, useState } from 'react';
import { Select } from 'grommet';
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
    <>
      <Select
        placeholder="Select token"
        labelKey="name"
        options={options}
        value={asset}
        onChange={({ option }) => omCurrencyChange(option)}
      />
      <MessageBox type="warn" show={noOptions}>
        {`The selected network does not support payments in ${payment.currency}`}
      </MessageBox>
    </>
  );
};
