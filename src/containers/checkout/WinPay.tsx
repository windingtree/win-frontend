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
import { BigNumber, providers } from 'ethers';
import { useAccount, useProvider } from 'wagmi';
import { AccordionBox } from 'src/components/AccordionBox';

const logger = Logger('WinPay');

export interface WinPayProps {
  payment?: Payment;
  onSuccess: (result: PaymentSuccess) => void;
}

export const WinPay = ({ payment, onSuccess }: WinPayProps) => {
  const isDesktop = useResponsive('up', 'md');
  const dispatch = useAppDispatch();
  const { selectedNetwork, selectedAsset } = useAppState();
  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const [withQuote, setWithQuote] = useState<boolean>(false);
  const [emptyBalance, setEmptyBalance] = useState<boolean>(true);

  useEffect(() => {
    const getBalance = async () => {
      try {
        if (provider && address && selectedNetwork?.ramp) {
          const currentBalance = await provider.getBalance(address);
          setEmptyBalance(currentBalance.eq(BigNumber.from(0)));
        } else {
          setEmptyBalance(false);
        }
      } catch (err) {
        logger.error(err);
        setEmptyBalance(false);
      }
    };
    getBalance();
  }, [provider, address, selectedNetwork, setEmptyBalance]);

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

  if (!payment || !isConnected) {
    return null;
  }

  return (
    <AccordionBox title="Payment Card">
      <CurrencySelector
        payment={payment}
        network={selectedNetwork}
        onQuote={onUseQuoteChange}
      />

      <Box sx={{ mb: 3 }}>
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
        provider={provider as providers.JsonRpcProvider}
        network={selectedNetwork}
        asset={selectedAsset}
        payment={payment}
        withQuote={withQuote}
        onSuccess={onSuccess}
      />
    </AccordionBox>
  );
};
