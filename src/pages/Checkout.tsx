import { PaymentSuccessCallback } from '../components/PaymentCard';
import { utils } from 'ethers';
import { Container, Box, CircularProgress, Typography, Card } from '@mui/material';
import { useTheme } from '@mui/material/styles';
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
import Logger from '../utils/logger';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useAccommodationsAndOffers } from '../hooks/useAccommodationsAndOffers.tsx';

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
  const theme = useTheme();
  const { checkout, account } = useAppState();
  const { latestQueryParams } = useAccommodationsAndOffers();

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

  const payment = useMemo(
    () =>
      checkout && {
        currency: checkout.offer.price.currency,
        value: utils.parseEther(checkout.offer.price.public.toString()),
        expiration: normalizeExpiration(checkout.offer.expiration),
        providerId: String(checkout.provider),
        serviceId: String(checkout.serviceId),
        quote: checkout.quote
      },
    [checkout]
  );

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
      })}`
    });
  }, []);

  if (!checkout || !payment) {
    return (
      <MainLayout>
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
        <Container
          sx={{
            mb: theme.spacing(5)
          }}
        >
          <CircularProgress />
        </Container>
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
            {formatPrice(
              utils.parseEther(checkout.offer.price.public.toString()),
              checkout.offer.price.currency
            )}
          </Typography>
          {checkout.quote &&
            checkout.quote.targetAmount &&
            checkout.quote.targetCurrency && (
              <Typography variant="h5" textAlign={{ xs: 'center', lg: 'right' }}>
                Equivalent to&nbsp;
                {formatPrice(
                  utils.parseEther(checkout.quote.targetAmount.toString()),
                  checkout.quote.targetCurrency
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
              alt={checkout.accommodation.name}
            />
          </Card>
        </Box>
        <Box>
          <Typography>
            You are paying for stay in {checkout.accommodation.name}
          </Typography>
        </Box>
      </Box>

      {!account && <SignInButton size="large" sx={{ padding: 5 }} />}

      <WinPay payment={payment} onSuccess={onPaymentSuccess} />
    </MainLayout>
  );
};
