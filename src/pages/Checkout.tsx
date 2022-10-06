import { utils } from 'ethers';
import { useCallback, useMemo } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import { useAccommodationsAndOffers } from '../hooks/useAccommodationsAndOffers.tsx';
import { useCheckout } from 'src/hooks/useCheckout';
import { Quote } from '@windingtree/glider-types/dist/win';
import { CheckoutSummary } from 'src/containers/checkout/CheckoutSummary';
import { sortByLargestImage } from 'src/utils/accommodation';
import { Typography } from '@mui/material';
import MainLayout from 'src/layouts/main';
import { WinPay } from 'src/containers/checkout/WinPay';
import { useAppState } from 'src/store';
import { expirationGap } from 'src/config';
import Logger from 'src/utils/logger';
import { Breadcrumbs } from 'src/components/Breadcrumbs';
import { Payment, PaymentSuccessCallback } from 'src/components/PaymentCard';

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
  const { checkout } = useAppState();
  const { latestQueryParams } = useAccommodationsAndOffers();
  const isGroupMode = bookingMode === 'group' ? true : false;
  const accommodationName = bookingInfo?.accommodation?.name;

  const query = useMemo(() => {
    const roomCount = bookingInfo?.roomCount?.toString() || ' ';
    const adultCount = bookingInfo?.adultCount?.toString() || ' ';
    const params = {
      roomCount,
      adultCount,
      startDate: bookingInfo?.date?.arrival.toString() ?? '',
      endDate: bookingInfo?.date?.arrival.toString() ?? '',
      location: latestQueryParams?.location ?? ''
    };

    return createSearchParams(params);
  }, [bookingInfo, createSearchParams]);

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
      const quote: Quote = {
        quoteId: 'dummy',
        sourceCurrency: 'USD',
        sourceAmount: depositOptions.usd || 'dummy',
        targetCurrency: 'dummy',
        targetAmount: 'dummy',
        rate: 'dummy'
      };

      paymentValue = {
        currency: depositOptions.offerCurrency.currency,
        value: utils.parseEther(bookingInfo.depositOptions.offerCurrency.amount),
        expiration: normalizeExpiration(expiration),
        providerId,
        serviceId,
        quote: depositOptions.usd ? quote : undefined
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

  const accommodationImage = useMemo(() => {
    if (isGroupMode && bookingInfo?.accommodation) {
      return sortByLargestImage(bookingInfo.accommodation.media)[0];
    }

    if (checkout) return sortByLargestImage(checkout.accommodation.media)[0];
  }, [checkout]);

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
      {!payment && (
        <Typography>Missing data to do the payment. Please try again.</Typography>
      )}
      {payment && (
        <>
          <CheckoutSummary
            payment={payment}
            accommodationName={accommodationName}
            accommodationImage={accommodationImage}
          />
          <WinPay payment={payment} onSuccess={onPaymentSuccess} />
        </>
      )}
    </MainLayout>
  );
};
