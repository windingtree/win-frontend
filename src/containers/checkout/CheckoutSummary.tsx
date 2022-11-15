import { utils } from 'ethers';
import { Box, Typography, Card } from '@mui/material';
import { formatPrice, stringToNumber } from 'src/utils/strings';
import { CardMediaFallback } from 'src/components/CardMediaFallback';
import { useMemo } from 'react';
import { sortByLargestImage } from 'src/utils/accommodation';
import { useCheckout } from 'src/hooks/useCheckout';
import { CurrencyCode, useCurrencies } from '../../hooks/useCurrencies';
import { useUserSettings } from '../../hooks/useUserSettings';
import { displayPriceFromValues } from '../../utils/price';

export const CheckoutSummary = () => {
  const { bookingMode, bookingInfo } = useCheckout();
  const { convertCurrency } = useCurrencies();
  const { preferredCurrencyCode } = useUserSettings();
  const isGroupMode = bookingMode === 'group' ? true : false;
  const accommodationName = bookingInfo?.accommodation?.name;

  const accommodationImage = useMemo(() => {
    if (bookingInfo?.accommodation) {
      return sortByLargestImage(bookingInfo.accommodation.media)[0];
    }
  }, [bookingInfo]);

  if (!bookingInfo?.pricing) return <></>;

  const formattedOfferPrice = formatPrice(
    utils.parseEther(bookingInfo.pricing?.offerCurrency.amount.toString()),
    bookingInfo.pricing?.offerCurrency.currency
  );

  const title = isGroupMode
    ? `The refundable deposit is ${formattedOfferPrice}`
    : `Your payment value is ${formattedOfferPrice}`;

  const formattedUsdPrice =
    bookingInfo.pricing?.usd &&
    formatPrice(utils.parseEther(bookingInfo.pricing.usd.toString()), 'USD');
  const subTitle = `Equivalent to ${formattedUsdPrice}`;

  const showUSDPrice =
    formattedUsdPrice && bookingInfo.pricing?.offerCurrency.currency != 'USD';

  const preferredCurrencyPrice = convertCurrency(
    bookingInfo.pricing?.offerCurrency.currency as CurrencyCode,
    preferredCurrencyCode,
    stringToNumber(bookingInfo.pricing?.offerCurrency.amount, undefined, false)
  );

  const showPreferredCurrencyPrice =
    preferredCurrencyPrice &&
    bookingInfo.pricing?.offerCurrency.currency != preferredCurrencyCode &&
    preferredCurrencyCode !== 'USD';
  const subTitle2 = `Equivalent to ${displayPriceFromValues(
    preferredCurrencyPrice?.amount,
    preferredCurrencyCode
  )}`;

  return (
    <Box>
      <Box mb={{ xs: 3, lg: 5 }}>
        <Box
          sx={{
            display: 'inline-block'
          }}
        >
          <Typography variant="h4">{title}</Typography>
          {showUSDPrice && <Typography variant="h5">{subTitle}</Typography>}
          {showPreferredCurrencyPrice && (
            <Typography variant="h6">{subTitle2}</Typography>
          )}
        </Box>
      </Box>

      <Box
        flexDirection={{ xs: 'column', lg: 'row' }}
        sx={{
          display: 'flex',
          marginBottom: 5
        }}
      >
        <Box mr={{ xs: 0, lg: 5 }} mb={{ xs: 3, lg: 0 }}>
          <Card>
            <CardMediaFallback
              component="img"
              height="200"
              src={accommodationImage?.url}
              fallback="/images/hotel-fallback.webp"
              alt={accommodationName}
            />
          </Card>
        </Box>
        <Box>
          <Typography>You are paying for stay in {accommodationName}</Typography>
        </Box>
      </Box>
    </Box>
  );
};
