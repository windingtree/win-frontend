import { Payment, PaymentSuccessCallback } from '../components/PaymentCard';
import { utils } from 'ethers';
import { Box, CircularProgress, Typography, Card } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import MainLayout from '../layouts/main';
import { WinPay } from '../components/WinPay';
import { SignInButton } from '../components/Web3Modal';
import { CardMediaFallback } from '../components/CardMediaFallback';
import { formatPrice } from '../utils/strings';
import { useAppState } from '../store';
import { expirationGap } from '../config';
import { sortByLargestImage } from '../utils/accommodation';
import FallbackImage from '../images/hotel-fallback.webp';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useAccommodationsAndOffers } from '../hooks/useAccommodationsAndOffers.tsx';
import Logger from '../utils/logger';
import { useCheckout } from 'src/hooks/useCheckout';

const logger = Logger('Checkout');

export interface CheckoutPrice {
  value: string;
  currency: string;
}

export interface PriceSelectProps {
  onChange(price: CheckoutPrice | null): void;
}

export const normalizeExpiration = (expirationDate: string): number =>
  Math.ceil(DateTime.fromISO(expirationDate).toSeconds()) - expirationGap;

export const Checkout = () => {
  const navigate = useNavigate();
  const { bookingMode, bookingInfo } = useCheckout();
  const { checkout, account } = useAppState();
  const { latestQueryParams } = useAccommodationsAndOffers();
  const isGroupMode = bookingMode === 'group' ? true : false;
  const accommodationName = isGroupMode
    ? bookingInfo?.accommodation?.name
    : checkout?.accommodation.name;

  /**
   * Currently
   */
  const query = useMemo(() => {
    if (latestQueryParams === undefined) {
      return '';
    }
    const params = {
      roomCount: latestQueryParams.roomCount.toString(),
      adultCount: latestQueryParams.adultCount.toString(),
      startDate: latestQueryParams.arrival?.toISOString() ?? '',
      endDate: latestQueryParams.departure?.toISOString() ?? '',
      location: latestQueryParams.location
    };

    return createSearchParams(params);
  }, [latestQueryParams, createSearchParams]);

  const payment = useMemo(() => {
    let paymentValue: Payment;

    if (
      isGroupMode &&
      bookingInfo &&
      bookingInfo.depositOptions &&
      bookingInfo.expiration &&
      bookingInfo.serviceId &&
      bookingInfo.providerId
    ) {
      const { depositOptions, expiration, providerId, serviceId } = bookingInfo;
      if (!depositOptions.usd) return;

      paymentValue = {
        currency: depositOptions.offerCurrency.currency,
        value: utils.parseEther(bookingInfo.depositOptions.offerCurrency.amount),
        expiration: Number(expiration),
        providerId,
        serviceId,
        quote: {
          quoteId: 'dummy',
          sourceCurrency: 'USD',
          sourceAmount: depositOptions.usd,
          targetCurrency: 'dummy',
          targetAmount: 'dummy',
          rate: 'dummy'
        }
      };
      return paymentValue;
    }

    if (checkout) {
      paymentValue = {
        currency: checkout.offer.price.currency,
        value: utils.parseEther(checkout.offer.price.public.toString()),
        expiration: normalizeExpiration(checkout.offer.expiration),
        providerId: checkout?.provider.toString(),
        serviceId: checkout?.serviceId.toString(),
        quote: checkout.quote
      };

      return paymentValue;
    }
    return;
  }, [checkout]);

  const hotelImage = useMemo(
    () => checkout && sortByLargestImage(checkout.accommodation.media)[0],
    [checkout]
  );

  const onPaymentSuccess = useCallback<PaymentSuccessCallback>((result) => {
    if (!checkout) return;
    logger.debug(`Payment result:`, result);
    navigate({
      pathname: '/bookings/confirmation',
      search: `?${createSearchParams({
        offerId: checkout.offerId,
        tx: result.tx.hash
      })}`,
      hash: latestQueryParams?.location === 'Bogota' ? 'devcon' : ''
    });
  }, []);

  if (!payment) {
    return (
      <MainLayout maxWidth="lg">
        <Breadcrumbs
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
              href: checkout ? `/facility/${checkout.facilityId}` : `/search?${query}`
            },
            {
              name: 'Guest Info',
              href: '/guest-info'
            }
          ]}
        />

        <CircularProgress />
      </MainLayout>
    );
  }

  return (
    <MainLayout maxWidth="lg">
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
            href: checkout ? `/facility/${checkout.facilityId}` : `/search?${query}`
          },
          {
            name: 'Guest Info',
            href: '/guest-info'
          }
        ]}
      />

      {!account && (
        <Typography variant="h3" mb={3}>
          Please connect your wallet to proceed with the Payment
        </Typography>
      )}
      <Box textAlign={{ xs: 'center', lg: 'left' }} marginBottom={{ xs: 3, lg: 5 }}>
        <Box
          sx={{
            display: 'inline-block'
          }}
        >
          <Typography variant="h3">
            Your payment value is&nbsp;
            {formatPrice(payment.value, payment.currency)}
          </Typography>
          {payment?.quote && (
            <Typography variant="h5" textAlign={{ xs: 'center', lg: 'right' }}>
              Equivalent to&nbsp;
              {formatPrice(
                utils.parseEther(payment.quote.sourceAmount.toString()),
                payment.quote.sourceCurrency
              )}
            </Typography>
          )}
        </Box>
      </Box>

      <Box
        flexDirection={{ xs: 'column', lg: 'row' }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 5
        }}
      >
        <Box marginRight={{ xs: 0, lg: 5 }} marginBottom={{ xs: 3, lg: 0 }}>
          <Card>
            <CardMediaFallback
              component="img"
              height="200"
              src={hotelImage?.url}
              fallback={FallbackImage}
              alt={accommodationName}
            />
          </Card>
        </Box>
        <Box>
          <Typography>You are paying for stay in {accommodationName}</Typography>
        </Box>
      </Box>

      {!account && <SignInButton size="large" sx={{ padding: 5 }} />}

      <WinPay payment={payment} onSuccess={onPaymentSuccess} />
    </MainLayout>
  );
};
