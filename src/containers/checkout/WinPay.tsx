import { NetworkInfo, CryptoAsset } from '@windingtree/win-commons/dist/types';
import { useState, useCallback, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useAppDispatch, useAppState } from 'src/store';
import { useResponsive } from 'src/hooks/useResponsive';
import { AssetSelector } from 'src/components/AssetSelector';
import { NetworkSelector } from 'src/components/NetworkSelector';
import { Payment, PaymentCard, PaymentSuccess } from 'src/components/PaymentCard';
import { CurrencySelector } from 'src/components/CurrencySelector';
import Logger from 'src/utils/logger';
import { MessageBox } from 'src/components/MessageBox';
import { ExternalLink } from 'src/components/ExternalLink';
import { BigNumber } from 'ethers';

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
  const [emptyBalance, setEmptyBalance] = useState<boolean>(true);

  useEffect(() => {
    const getBalance = async () => {
      try {
        if (provider && account) {
          const currentBalance = await provider.getBalance(account);
          setEmptyBalance(currentBalance.eq(BigNumber.from(0)));
        } else {
          setEmptyBalance(true);
        }
      } catch (err) {
        logger.error(err);
        setEmptyBalance(true);
      }
    };
    getBalance();
  }, [provider, account, selectedNetwork, setEmptyBalance]);

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
        <MessageBox type="warn" show={!!selectedNetwork && emptyBalance}>
          <Typography variant="body1">
            Not enough {selectedNetwork?.currency} for transaction. Get some{' '}
            <ExternalLink href={`${selectedNetwork?.currency}${account}`} target="_blank">
              on ramp
            </ExternalLink>
          </Typography>
        </MessageBox>
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
