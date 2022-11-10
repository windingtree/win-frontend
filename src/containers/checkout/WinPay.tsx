import { CryptoAsset } from '@windingtree/win-commons/dist/types';
import { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { useAppDispatch, useAppState } from 'src/store';
import { useResponsive } from 'src/hooks/useResponsive';
import { AssetSelector } from 'src/components/AssetSelector';
import { NetworkSelector } from 'src/components/NetworkSelector';
import { Payment, PaymentCard, PaymentSuccess } from 'src/components/PaymentCard';
import { CurrencySelector } from 'src/components/CurrencySelector';
import Logger from 'src/utils/logger';
import { useNetwork, useAccount, useProvider, useSwitchNetwork } from '@web3modal/react';
import { ethers } from 'ethers';
import { MessageBox } from 'src/components/MessageBox';
import { ExternalLink } from 'src/components/ExternalLink';

const logger = Logger('WinPay');

export interface WinPayProps {
  payment?: Payment;
  onSuccess: (result: PaymentSuccess) => void;
}

export const WinPay = ({ payment, onSuccess }: WinPayProps) => {
  const isDesktop = useResponsive('up', 'md');
  const dispatch = useAppDispatch();
  const { selectedAsset } = useAppState();

  const { account, isReady: isAccountReady } = useAccount();
  const { network, isReady: isNetworkReady } = useNetwork();
  const { provider, isReady: isProviderReady } = useProvider({
    chainId: network?.chain?.id
  });

  const [withQuote, setWithQuote] = useState<boolean>(false);

  const setAsset = useCallback(
    (asset: CryptoAsset) =>
      dispatch({
        type: 'SET_SELECTED_ASSET',
        payload: asset
      }),
    [dispatch]
  );

  const { data: newNetwork, switchNetwork } = useSwitchNetwork();

  const onUseQuoteChange = (useQuote: boolean) => {
    logger.debug('onUseQuoteChange', useQuote);
    setWithQuote(useQuote);
  };

  if (!payment || !provider || !isProviderReady || !isAccountReady || !isNetworkReady) {
    return null;
  }
  // console.log('NETWORK', network);
  // console.log('NEW_NETWORK', newNetwork);
  // console.log('PROVIDER', provider);
  return (
    <>
      {account.isConnected && (
        <CurrencySelector
          payment={payment}
          network={network?.chain}
          onQuote={onUseQuoteChange}
        />
      )}
      <Box marginBottom={5}>
        {account.isConnected && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: isDesktop ? 'row' : 'column',
              alignItems: isDesktop ? 'top' : 'stretch',
              gap: 2
            }}
          >
            <NetworkSelector
              provider={provider as unknown as ethers.providers.Web3Provider}
              value={network?.chain?.id}
              onChange={switchNetwork}
            />
            <AssetSelector
              network={network?.chain}
              payment={payment}
              withQuote={withQuote}
              asset={selectedAsset}
              onChange={setAsset}
            />
          </Box>
        )}
        <MessageBox type="warning" show={emptyBalance}>
          <Typography variant="body1">
            You don’t have enough {selectedNetwork?.currency} in your wallet, please
            top-up your wallet before proceeding{' '}
            {selectedNetwork?.ramp !== undefined && (
              <ExternalLink href={selectedNetwork?.ramp} target="_blank">
                Add {selectedNetwork?.currency}
              </ExternalLink>
            )}
          </Typography>
        </MessageBox>
      </Box>
      <PaymentCard
        account={account.address}
        provider={provider as unknown as ethers.providers.Web3Provider}
        network={network?.chain}
        asset={selectedAsset}
        payment={payment}
        withQuote={withQuote}
        onSuccess={onSuccess}
      />
    </>
  );
};
