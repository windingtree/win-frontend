import { useCallback, useMemo } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import { useCheckout } from 'src/hooks/useCheckout';
import { Box, Typography } from '@mui/material';
import MainLayout from 'src/layouts/main';
import { WinPay } from 'src/containers/checkout/WinPay';
import { expirationGap } from 'src/config';
import Logger from 'src/utils/logger';
import { PaymentSuccessCallback } from 'src/components/PaymentCard';
import { CheckoutOverview } from 'src/containers/checkout/CheckoutOverview.tsx';
import { IconButtonAnimate } from 'src/components/animate';
import Iconify from 'src/components/Iconify';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const logger = Logger('Checkout');

export const normalizeExpiration = (expirationDate: string): number =>
  Math.ceil(DateTime.fromISO(expirationDate).toSeconds()) - expirationGap;

export const Checkout = () => {
  const navigate = useNavigate();
  const { bookingInfo, bookingMode } = useCheckout();
  const { isConnected } = useAccount();
  const isGroupMode = bookingMode === 'group';
  const offerId = isGroupMode ? bookingInfo?.requestId : bookingInfo?.pricedOfferId;

  const payment = useMemo(() => {
    if (!bookingInfo) return;
    const { pricing, providerId, serviceId, quote, offers } = bookingInfo;
    if (!pricing || !providerId || !serviceId || !offers) return;

    const expiration = offers[0].expiration;

    return {
      currency: pricing.offerCurrency.currency,
      value: pricing.offerCurrency.amount,
      expiration: normalizeExpiration(expiration),
      providerId: providerId.toString(),
      serviceId: serviceId.toString(),
      quote: quote
    };
  }, [bookingInfo]);

  const onPaymentSuccess = useCallback<PaymentSuccessCallback>(
    (result) => {
      if (!bookingInfo) return;

      logger.debug(`Payment result:`, result);
      navigate({
        pathname: '/bookings/confirmation',
        search: `?${createSearchParams({
          offerId: offerId || ' ',
          tx: result.tx.hash
        })}`,
        hash: bookingInfo?.location === 'Bogota' ? 'devcon' : ''
      });
    },
    [bookingInfo, navigate, offerId]
  );

  return (
    <MainLayout maxWidth="md">
      <IconButtonAnimate
        size="small"
        sx={{ p: 0.5 }}
        color="default"
        onClick={() => navigate(-1)}
      >
        <Iconify icon="eva:arrow-ios-back-fill" />
      </IconButtonAnimate>
      {!payment && (
        <Typography>Missing data to do the payment. Please try again.</Typography>
      )}
      {payment && (
        <>
          <CheckoutOverview />
          {!isConnected && (
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography fontWeight="bold" mb={1}>
                Please connect your wallet to proceed
              </Typography>
              <ConnectButton />
            </Box>
          )}
          <Box sx={{ mb: 5 }}>
            <WinPay payment={payment} onSuccess={onPaymentSuccess} />
          </Box>
        </>
      )}
    </MainLayout>
  );
};
