import { Payment } from './PaymentCard';
import { NetworkInfo, CryptoAsset } from '@windingtree/win-commons/dist/types';
import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { BigNumber, utils } from 'ethers';
import { getNetworkInfo } from '../config';
import Logger from '../utils/logger';

const logger = Logger('CurrencySelector');

export interface CheckoutPrice {
  value: BigNumber;
  currency: string;
}

export interface PriceSelectProps {
  payment?: Payment;
  network?: NetworkInfo;
  onQuote(useQuote: boolean): void;
}

export const CurrencySelector = ({ payment, network, onQuote }: PriceSelectProps) => {
  const [value, setValue] = useState<string | null>(payment ? payment.currency : null);

  const options = useMemo<CheckoutPrice[]>(
    () =>
      payment
        ? [
            {
              value: payment.value,
              currency: payment.currency
            },
            ...(payment.quote
              ? [
                  {
                    value: BigNumber.from(
                      utils.parseEther(payment.quote.targetAmount ?? '0')
                    ),
                    currency: payment.quote.targetCurrency ?? 'USD'
                  }
                ]
              : [])
          ]
        : [],
    [payment]
  );

  const tokens = useMemo<CryptoAsset[]>(() => {
    if (!payment || !network) {
      return [];
    }
    const chain = getNetworkInfo(network.chainId);
    return [...chain.contracts.assets.filter((a) => a.currency === payment.currency)];
  }, [network, payment]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = (event.target as HTMLInputElement).value;
      setValue(newValue);
      logger.debug('Currency selected:', newValue);
      const nextPrice = options.find((o) => o.currency === newValue) ?? null;
      const useQuote = nextPrice?.currency === 'USD';
      onQuote(useQuote);
      logger.debug('Use quote:', useQuote);
    },
    [onQuote]
  );

  useEffect(() => {
    if (payment && payment.quote && tokens.length === 0) {
      setValue('USD');
      logger.debug('Currency automatically selected: USD');
      onQuote(true);
      logger.debug('Checkout price updated:', true);
    }
  }, [payment, tokens, onQuote]);

  if (!payment || !network) {
    return null;
  }

  return (
    <FormControl>
      <FormLabel id="controlled-currency-selector">
        {tokens.length > 0
          ? 'Select which currency you would like to pay with'
          : 'Please select a USD-pegged stablecoin'}
      </FormLabel>
      <RadioGroup
        aria-labelledby="controlled-currency-selector"
        name="controlled-currency-selector"
        value={value}
        onChange={handleChange}
        sx={{
          display: 'inline-block'
        }}
      >
        {options.map((p, index) => (
          <FormControlLabel
            key={index}
            control={<Radio />}
            value={p.currency}
            label={`Pay in ${p.currency}`}
            disabled={tokens.length === 0 && p.currency !== 'USD'}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
