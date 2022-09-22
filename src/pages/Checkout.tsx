import { PaymentSuccessCallback } from '../components/PaymentCard';
import { utils } from 'ethers';
import {
  Container,
  Box,
  CircularProgress,
  Typography,
  Card,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormHelperText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useCallback, useMemo, useState } from 'react';
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
import useResponsive from '../hooks/useResponsive';
import FallbackImage from '../images/hotel-fallback.webp';
import Logger from '../utils/logger';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useAccommodationsAndOffers } from '../hooks/useAccommodationsAndOffers.tsx';
import { CheckOut } from '../store/types';

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

export const PaymentCurrencySelector = ({
  offer,
  quote,
  onChange
}: CheckOut & PriceSelectProps) => {
  const [price, setPrice] = useState<CheckoutPrice | null>(
    offer
      ? {
          value: offer.price.public,
          currency: offer.price.currency
        }
      : null
  );

  const options = useMemo<CheckoutPrice[]>(
    () =>
      offer
        ? [
            {
              value: offer.price.public,
              currency: offer.price.currency
            },
            ...(quote
              ? [
                  {
                    value: quote.targetAmount || '',
                    currency: quote.targetCurrency || ''
                  }
                ]
              : [])
          ]
        : [],
    [offer, quote]
  );

  const onPriceSelect = useCallback(
    (e: SelectChangeEvent) => {
      const nextPrice = options.find((o) => o.currency === e.target.value) ?? null;
      setPrice(nextPrice);
      onChange(nextPrice);
    },
    [options]
  );

  if (!offer) {
    return null;
  }

  if (!quote) {
    return (
      <Typography variant="h3" component="span">
        {formatPrice(
          utils.parseEther(offer.price.public.toString()),
          offer.price.currency
        )}
      </Typography>
    );
  }

  return (
    <Box>
      <Select value={price?.currency} onChange={onPriceSelect}>
        {options.map((p, index) => (
          <MenuItem key={index} value={p.currency}>
            <Typography variant="h3" component="span">
              {formatPrice(utils.parseEther(p.value), p.currency)}
            </Typography>
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Select the payment currency</FormHelperText>
    </Box>
  );
};

export const Checkout = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useResponsive('up', 'md');
  const { checkout, account } = useAppState();
  const { latestQueryParams } = useAccommodationsAndOffers();
  const [priceOverride, setPriceOverride] = useState<CheckoutPrice | null>(null);

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
        currency: priceOverride ? priceOverride.currency : checkout.offer.price.currency,
        value: utils.parseEther(
          priceOverride ? priceOverride.value : checkout.offer.price.public.toString()
        ),
        expiration: normalizeExpiration(checkout.offer.expiration),
        providerId: String(checkout.provider),
        serviceId: String(checkout.serviceId)
      },
    [checkout, priceOverride]
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
      <Box
        sx={{
          marginBottom: isDesktop ? 5 : 3,
          textAlign: isDesktop ? 'left' : 'center'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                marginTop: checkout.quote ? '-28px' : '0px'
              }}
            >
              Your payment value is
            </Typography>
          </Box>
          <PaymentCurrencySelector onChange={setPriceOverride} {...checkout} />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: isDesktop ? 'row' : 'column',
          alignItems: 'center',
          marginBottom: theme.spacing(5)
        }}
      >
        <Box
          sx={{
            marginRight: isDesktop ? theme.spacing(5) : 0,
            marginBottom: isDesktop ? 0 : theme.spacing(3)
          }}
        >
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
