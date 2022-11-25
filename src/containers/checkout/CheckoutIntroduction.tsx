import { Box, Card, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { stringToNumber } from 'src/utils/strings';
import { daysBetween } from 'src/utils/date';
import { useCheckout } from 'src/hooks/useCheckout';
import { sortByLargestImage } from 'src/utils/accommodation';
import { useMemo } from 'react';
import { CardMediaFallback } from 'src/components/CardMediaFallback';
import { CurrencyCode, useCurrencies } from '../../hooks/useCurrencies';
import { useUserSettings } from '../../hooks/useUserSettings';
import { displayPriceFromValues } from '../../utils/price';
import { getRndHotelImg, getAccommodationImage } from '../../utils/getRndHotelImg';
import { AccordionMobileBox } from 'src/components/AccordionMobileBox';
import { useResponsive } from 'src/hooks/useResponsive';

export const CheckoutIntroduction = () => {
  const theme = useTheme();
  const { bookingMode, bookingInfo } = useCheckout();
  const { convertCurrency } = useCurrencies();
  const { preferredCurrencyCode } = useUserSettings();
  const isDesktop = useResponsive('up', 'md');

  const accommodationImage = useMemo(() => {
    if (bookingInfo?.accommodation) {
      return sortByLargestImage(bookingInfo.accommodation.media)[0];
    }
  }, [bookingInfo]);

  // This random image will be used instead of the test image with text "TEST IMAGE: this image is not a bug".
  const rndImg = useMemo<string>(getRndHotelImg, []);
  const imgUrl = useMemo<string | undefined>(() => {
    const originalUrl = accommodationImage ? accommodationImage.url : '';
    return getAccommodationImage(originalUrl, rndImg);
  }, [accommodationImage, rndImg]);

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

  const offerCurrency = bookingInfo.pricing.offerCurrency.currency;
  const formattedOfferPrice = displayPriceFromValues(
    bookingInfo.pricing.offerCurrency.amount,
    bookingInfo.pricing.offerCurrency.currency
  );

  const daysOfStay = daysBetween(bookingInfo.date.arrival, bookingInfo.date.departure);
  let formattedPricePerDay = formattedOfferPrice;
  if (daysOfStay > 1) {
    const pricePerDay: number =
      parseFloat(bookingInfo.pricing.offerCurrency.amount) / daysOfStay;
    formattedPricePerDay = displayPriceFromValues(
      pricePerDay,
      bookingInfo.pricing.offerCurrency.currency
    );
  }

  const formattedUsdPrice =
    bookingInfo.pricing.usd && displayPriceFromValues(bookingInfo.pricing.usd, 'USD');

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

  return (
    <AccordionMobileBox title={`Your payment value is ${formattedOfferPrice}`}>
      <Box
        mb={{ xs: 3, lg: 5 }}
        style={
          isDesktop
            ? {
                borderWidth: '0.1em',
                borderStyle: 'solid',
                borderColor: theme.palette.text.secondary,
                borderRadius: theme.shape.borderRadius,
                // minWidth: '25em',
                padding: '1.2em' // TODO: figure out theme default padding value for cards
              }
            : {}
        }
      >
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
              src={imgUrl}
              fallback="/images/hotel-fallback.webp"
              alt={accommodationName}
            />
          </Card>
        </Box>
        {isGroupMode && (
          <Typography mb={{ xs: 3, lg: 2 }} variant="h5">
            The refundable deposit is {formattedOfferPrice}
          </Typography>
        )}
        {!isGroupMode && isDesktop && (
          <Typography mb={{ xs: 3, lg: 2 }} variant="h5">
            Your payment value is {formattedOfferPrice}
          </Typography>
        )}
        <Typography mb={{ xs: 3, lg: 2 }} variant="h5">
          Price details
        </Typography>
        <Typography mb={{ xs: 3, lg: 2 }}>
          {formattedPricePerDay} x {daysOfStay} nights
        </Typography>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <Typography mb={{ xs: 3, lg: 2 }}>Total ({offerCurrency})</Typography>
          <Typography style={{ flexGrow: 1 }}>&nbsp;</Typography>
          <Typography mb={{ xs: 3, lg: 2 }}>{formattedOfferPrice}</Typography>
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
            <Typography mb={{ xs: 3, lg: 2 }}>{formattedUsdPrice}</Typography>
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
    </AccordionMobileBox>
  );
};
