import { NetworkInfo, CryptoAsset } from '@windingtree/win-commons/dist/types';
import { Payment, PaymentSuccess } from './PaymentCard';
import { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { useAppDispatch, useAppState } from '../store';
import { CurrencySelector } from './CurrencySelector';
import { NetworkSelector } from './NetworkSelector';
import { AssetSelector } from './AssetSelector';
import { PaymentCard } from './PaymentCard';
import useResponsive from '../hooks/useResponsive';
import Logger from '../utils/logger';

const logger = Logger('WinPay');

export interface WinPayProps {
  payment?: Payment;
  onSuccess: (result: PaymentSuccess) => void;
}

export const WinPay = ({ payment, onSuccess }: WinPayProps) => {
  const isDesktop = useResponsive('up', 'md');
  const dispatch = useAppDispatch();
  const { provider, account, selectedNetwork, selectedAsset } = useAppState();
  const [withQuote, setWithQuote] = useState<boolean>(false);

  const setNetwork = useCallback(
    (network: NetworkInfo) =>
      dispatch({
        type: 'SET_SELECTED_NETWORK',
        payload: network
      }),
    [dispatch]
  );

  const setAsset = useCallback(
    (asset: CryptoAsset) =>
      dispatch({
        type: 'SET_SELECTED_ASSET',
        payload: asset
      }),
    [dispatch]
  );

  const onUseQuoteChange = (useQuote: boolean) => {
    logger.debug('onUseQuoteChange', useQuote);
    setWithQuote(useQuote);
  };

  if (!payment) {
    return null;
  }

  return (
    <>
      {account && (
        <CurrencySelector
          asset={selectedAsset}
          payment={payment}
          network={selectedNetwork}
          onQuote={onUseQuoteChange}
        />
      )}
      <Box marginBottom={5}>
        {account && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: isDesktop ? 'row' : 'column',
              alignItems: isDesktop ? 'top' : 'stretch',
              gap: 2
            }}
          >
            <NetworkSelector value={selectedNetwork} onChange={setNetwork} />
            <AssetSelector
              network={selectedNetwork}
              payment={payment}
              withQuote={withQuote}
              asset={selectedAsset}
              onChange={setAsset}
            />
          </Box>
        )}
      </Box>
      <PaymentCard
        provider={provider}
        network={selectedNetwork}
        asset={selectedAsset}
        payment={payment}
        withQuote={withQuote}
        onSuccess={onSuccess}
      />
    </>
  );
};
