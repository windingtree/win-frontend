import type { NetworkInfo, CryptoAsset } from '../config';
import type { Payment, PaymentSuccess } from './PaymentCard';
import { useCallback } from 'react';
import { Box, Text } from 'grommet';
import { formatCost } from '../utils/strings';
import { useAppDispatch, useAppState } from '../store';
import { SignInButton, SignOutButton } from './Web3Modal';
import { NetworkSelector } from './NetworkSelector';
import { AssetSelector } from './AssetSelector';
import { PaymentCard } from './PaymentCard';

export interface WinPayProps {
  payment: Payment;
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

  return (
    <Box direction="column" gap="small" fill>
      <Box direction="row" align="right" gap="small">
        <Box direction="row" align="center">
          <Text size="middle" weight="bold">
            {formatCost(payment)}
          </Text>
        </Box>
        {account ? <SignOutButton /> : <SignInButton />}
      </Box>
      {account && (
        <Box direction="column" gap="small" fill>
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
