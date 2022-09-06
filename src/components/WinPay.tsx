import { NetworkInfo, CryptoAsset } from '@windingtree/win-commons/dist/types';
import { Payment, PaymentSuccess } from './PaymentCard';
import { useCallback } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAppDispatch, useAppState } from '../store';
import { NetworkSelector } from './NetworkSelector';
import { AssetSelector } from './AssetSelector';
import { PaymentCard } from './PaymentCard';
import useResponsive from '../hooks/useResponsive';

export interface WinPayProps {
  payment?: Payment;
  onSuccess: (result: PaymentSuccess) => void;
}

export const WinPay = ({ payment, onSuccess }: WinPayProps) => {
  const theme = useTheme();
  const isDesktop = useResponsive('up', 'md');
  const dispatch = useAppDispatch();
  const { provider, account, selectedNetwork, selectedAsset } = useAppState();

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

  if (!payment) {
    return null;
  }

  return (
    <>
      <Box marginBottom={theme.spacing(5)}>
        {account && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: isDesktop ? 'row' : 'column',
              alignItems: isDesktop ? 'top' : 'stretch',
              gap: theme.spacing(2)
            }}
          >
            <NetworkSelector value={selectedNetwork} onChange={setNetwork} />
            <AssetSelector
              network={selectedNetwork}
              payment={payment}
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
        onSuccess={onSuccess}
      />
    </>
  );
};
