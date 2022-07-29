import type { NetworkInfo, CryptoAsset } from '../config';
import { useCallback } from 'react';
import { Box } from 'grommet';
import { BigNumber } from 'ethers';
import { useAppDispatch, useAppState } from '../store';
import { SignInButton, SignOutButton } from './Web3Modal';
import { NetworkSelector } from './NetworkSelector';
import { CurrenciesSelector } from './CurrenciesSelector';
import { AssetCard } from './AssetCard';

export const allowedCurrencies = [
  'EUR',
  'USD'
];

export type AllowedCurrency = typeof allowedCurrencies[number];

export interface PaymentCost {
  currency: AllowedCurrency;
  value: BigNumber;
}

export interface WinPayProps {
  cost?: PaymentCost
}

export const WinPay = ({ cost }: WinPayProps) => {
  const dispatch = useAppDispatch();
  const {
    provider,
    account,
    selectedNetwork,
    selectedAsset
  } = useAppState();

  const setNetwork = useCallback(
    (network: NetworkInfo) => dispatch({
      type: 'SET_SELECTED_NETWORK',
      payload: network
    }),
    [dispatch]
  );

  const setAsset = useCallback(
    (asset: CryptoAsset) => dispatch({
      type: 'SET_SELECTED_ASSET',
      payload: asset
    }),
    [dispatch]
  );

  return (
    <Box direction="column" gap="small" fill>
      <Box direction="row" align="right" gap="small">
        {account ? <SignOutButton /> : <SignInButton />}
      </Box>
      {account &&
        <Box direction="column" gap="small" fill>
          <NetworkSelector
            value={selectedNetwork}
            onChange={setNetwork}
          />
          <CurrenciesSelector
            network={selectedNetwork}
            value={selectedAsset}
            onChange={setAsset}
          />
          <AssetCard
            provider={provider}
            network={selectedNetwork}
            asset={selectedAsset}
          />
        </Box>
      }
    </Box>
  );
};
