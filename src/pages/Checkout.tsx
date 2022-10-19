import { useCallback, useMemo } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import { useCheckout } from 'src/hooks/useCheckout';
import { Box, Typography } from '@mui/material';
import MainLayout from 'src/layouts/main';
import { WinPay } from 'src/containers/checkout/WinPay';
import { expirationGap } from 'src/config';
import Logger from 'src/utils/logger';
import { Breadcrumbs } from 'src/components/Breadcrumbs';
import { PaymentSuccessCallback } from 'src/components/PaymentCard';
import { SignInButton } from 'src/components/Web3Modal';
import { useAppState } from 'src/store';
import { getOfferId } from 'src/hooks/useCheckout/helpers';

import { CheckoutOverview } from 'src/containers/checkout/CheckoutOverview.tsx';

const logger = Logger('Checkout');

export const normalizeExpiration = (expirationDate: string): number =>
  Math.ceil(DateTime.fromISO(expirationDate).toSeconds()) - expirationGap;

export const Checkout = () => {
  const navigate = useNavigate();
  const { bookingInfo, bookingMode } = useCheckout();
  const { account } = useAppState();
  const isGroupMode = bookingMode === 'group';
  const offerId = !isGroupMode && bookingInfo?.offers && getOfferId(bookingInfo.offers);

  const query = useMemo(() => {
    const params = {
      roomCount: bookingInfo?.roomCount?.toString() || '',
      adultCount: bookingInfo?.adultCount?.toString() || ' ',
      startDate: bookingInfo?.date?.arrival.toString() ?? '',
      endDate: bookingInfo?.date?.departure.toString() ?? '',
      location: bookingInfo?.location ?? ''
    };

    return createSearchParams(params);
  }, [bookingInfo, createSearchParams]);

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
    [bookingInfo, navigate]
  );

  return (
    <MainLayout maxWidth="md">
      <Breadcrumbs
        sx={{ mb: 5 }}
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Search',
            href: `/search?${query}`
          },
          {
            name: 'Facility',
            href: bookingInfo?.accommodation
              ? `/facility/${bookingInfo?.accommodation.id}`
              : `/search?${query}`
          },
          {
            name: 'Guest Info',
            href: isGroupMode ? '/org-details' : '/guest-info'
          }
        ]}
      />
      {!payment && (
        <Typography>Missing data to do the payment. Please try again.</Typography>
      )}
      {payment && (
        <>
          <CheckoutOverview />
          {!account && (
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography fontWeight="bold" mb={1}>
                Please connect your wallet to proceed
              </Typography>

              <SignInButton size="large" sx={{ width: { xs: '100%', md: 'auto' } }} />
            </Box>
          )}
          <WinPay payment={payment} onSuccess={onPaymentSuccess} />
        </>
      )}
    </MainLayout>
  );
};
