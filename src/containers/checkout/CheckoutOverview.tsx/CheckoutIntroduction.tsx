import { utils } from 'ethers';
import { Box, Card, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { formatPrice, stringToNumber } from 'src/utils/strings';
import { daysBetween } from 'src/utils/date';
import { useCheckout } from 'src/hooks/useCheckout';
import { sortByLargestImage } from 'src/utils/accommodation';
import { useMemo } from 'react';
import { CardMediaFallback } from 'src/components/CardMediaFallback';
import FallbackImage from 'src/images/hotel-fallback.webp';
import { currencySymbolMap } from '@windingtree/win-commons/dist/currencies';
import { CurrencyCode, useCurrencies } from '../../../hooks/useCurrencies';
import { useUserSettings } from '../../../hooks/useUserSettings';
import { displayPriceFromValues } from '../../../utils/price';

export const CheckoutIntroduction = () => {
  const theme = useTheme();
  const { bookingMode, bookingInfo } = useCheckout();
  const { convertCurrency } = useCurrencies();
  const { preferredCurrencyCode } = useUserSettings();

  if (
    !bookingInfo ||
    !bookingInfo.pricing ||
    !bookingInfo.accommodation ||
    !bookingInfo.date
  ) {
    // don't render anything without pricing info, accommodation info, or dates
    return null;
  }

  const isGroupMode = bookingMode === 'group' ? true : false;
  const accommodationName = bookingInfo.accommodation.name;
  const hotelCity = bookingInfo.location;
  const googleMapsLink = `https://www.google.com/maps?hl=en&q=${encodeURIComponent(
    `${accommodationName}, ${hotelCity}`
  )}`;

  const formattedOfferPrice = formatPrice(
    utils.parseEther(bookingInfo.pricing.offerCurrency.amount.toString())
  );
  const formattedOfferSymbol =
    currencySymbolMap[bookingInfo.pricing.offerCurrency.currency];
  const offerCurrency = bookingInfo.pricing.offerCurrency.currency;

  const daysOfStay = daysBetween(bookingInfo.date.arrival, bookingInfo.date.departure);
  let pricePerDay = '0.00';
  if (daysOfStay > 0) {
    pricePerDay = (
      parseFloat(bookingInfo.pricing.offerCurrency.amount) / daysOfStay
    ).toFixed(2);
  }

  const formattedUsdPrice =
    bookingInfo.pricing.usd &&
    formatPrice(utils.parseEther(bookingInfo.pricing.usd.toString()));
  const formattedUsdSymbol = currencySymbolMap['USD'];

  const showUSDPrice =
    formattedUsdPrice && bookingInfo.pricing.offerCurrency.currency != 'USD';

  const preferredCurrencyPrice = convertCurrency(
    bookingInfo.pricing?.offerCurrency.currency as CurrencyCode,
    preferredCurrencyCode,
    stringToNumber(bookingInfo.pricing?.offerCurrency.amount, undefined, false)
  );

  const showPreferredCurrencyPrice =
    preferredCurrencyPrice &&
    bookingInfo.pricing?.offerCurrency.currency != preferredCurrencyCode &&
    preferredCurrencyCode !== 'USD';

  const accommodationImage = useMemo(() => {
    if (bookingInfo.accommodation) {
      return sortByLargestImage(bookingInfo.accommodation.media)[0];
    }
  }, [bookingInfo]);

  return (
    <Box
      mb={{ xs: 3, lg: 5 }}
      style={{
        borderWidth: '0.1em',
        borderStyle: 'solid',
        borderColor: theme.palette.text.secondary,
        borderRadius: theme.shape.borderRadius,
        minWidth: '25em',
        padding: '1.2em' // TODO: figure out theme default padding value for cards
      }}
    >
      {isGroupMode && (
        <>
          <Typography mt={2}>
            This 10% deposit is required to pre-book the rooms and get the best offer from
            the hotel. <b>You can get it back anytime.</b>
          </Typography>

          <Typography>
            Check out the{' '}
            <a target="_blank" href="/faq#group-booking">
              group booking guide
            </a>
            .
          </Typography>
        </>
      )}

      <Typography mb={{ xs: 3, lg: 2 }} variant="h5">
        {accommodationName}
      </Typography>
      {googleMapsLink && (
        <Typography mb={{ xs: 3, lg: 2 }}>
          <a href={googleMapsLink}>see on Google map</a>
        </Typography>
      )}
      <Box mb={{ xs: 3, lg: 2 }}>
        <Card>
          <CardMediaFallback
            component="img"
            height="200"
            src={accommodationImage?.url}
            fallback={FallbackImage}
            alt={accommodationName}
          />
        </Card>
      </Box>
      {isGroupMode && (
        <Typography mb={{ xs: 3, lg: 2 }} variant="h5">
          The refundable deposit is {formattedOfferSymbol}
          {formattedOfferPrice}
        </Typography>
      )}
      {!isGroupMode && (
        <Typography mb={{ xs: 3, lg: 2 }} variant="h5">
          Your payment value is {formattedOfferSymbol}
          {formattedOfferPrice}
        </Typography>
      )}
      <Typography mb={{ xs: 3, lg: 2 }} variant="h5">
        Price details
      </Typography>
      <Typography mb={{ xs: 3, lg: 2 }}>
        {formattedOfferSymbol} {pricePerDay} x {daysOfStay} nights
      </Typography>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row'
        }}
      >
        <Typography mb={{ xs: 3, lg: 2 }}>Total ({offerCurrency})</Typography>
        <Typography style={{ flexGrow: 1 }}>&nbsp;</Typography>
        <Typography mb={{ xs: 3, lg: 2 }}>
          {formattedOfferSymbol} {formattedOfferPrice}
        </Typography>
      </Box>
      {showUSDPrice && (
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <Typography mb={{ xs: 3, lg: 2 }}>Equivalent amount in USD</Typography>
          <Typography style={{ flexGrow: 1 }}>&nbsp;</Typography>
          <Typography mb={{ xs: 3, lg: 2 }}>
            {formattedUsdSymbol} {formattedUsdPrice}
          </Typography>
        </Box>
      )}
      {showPreferredCurrencyPrice && (
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <Typography mb={{ xs: 3, lg: 2 }}>
            Equivalent amount in {preferredCurrencyCode}
          </Typography>
          <Typography style={{ flexGrow: 1 }}>&nbsp;</Typography>
          <Typography mb={{ xs: 3, lg: 2 }}>
            {displayPriceFromValues(
              preferredCurrencyPrice?.amount,
              preferredCurrencyCode
            )}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
