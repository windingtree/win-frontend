import type { NetworkInfo, CryptoAsset } from '@windingtree/win-commons/dist/types';
import type { Payment, PaymentSuccess } from './PaymentCard';
import { useCallback } from 'react';
import { Box } from '@mui/material';
import { useAppDispatch, useAppState } from '../store';
import { NetworkSelector } from './NetworkSelector';
import { AssetSelector } from './AssetSelector';
import { PaymentCard } from './PaymentCard';

export interface WinPayProps {
  payment?: Payment;
  onSuccess: (result: PaymentSuccess) => void;
}

export const WinPay = ({ payment, onSuccess }: WinPayProps) => {
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
    <Box>
      {account && (
        <Box>
          <NetworkSelector value={selectedNetwork} onChange={setNetwork} />
          <AssetSelector
            network={selectedNetwork}
            payment={payment}
            asset={selectedAsset}
            onChange={setAsset}
          />
          <PaymentCard
            provider={provider}
            network={selectedNetwork}
            asset={selectedAsset}
            payment={payment}
            onSuccess={onSuccess}
          />
        </Box>
      )}
    </Box>
  );
};
