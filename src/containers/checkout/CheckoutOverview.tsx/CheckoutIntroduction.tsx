import { utils } from 'ethers';
import { Box, Card, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { formatPrice } from 'src/utils/strings';
import { useCheckout } from 'src/hooks/useCheckout';
import { sortByLargestImage } from 'src/utils/accommodation';
import { useMemo } from 'react';
import { CardMediaFallback } from 'src/components/CardMediaFallback';
import FallbackImage from 'src/images/hotel-fallback.webp';

export const CheckoutIntroduction = () => {
  const theme = useTheme();
  const { bookingMode, bookingInfo } = useCheckout();

  if (!bookingInfo || !bookingInfo.pricing || !bookingInfo.accommodation) {
    // don't render anything without pricing info, or accommodation info
    return null;
  }

  const isGroupMode = bookingMode === 'group' ? true : false;
  const accommodationName = bookingInfo.accommodation.name;
  const googleMapsLink = `https://www.google.com/maps?hl=en&q=${encodeURIComponent(
    accommodationName
  )}`;

  const formattedOfferPrice = formatPrice(
    utils.parseEther(bookingInfo.pricing.offerCurrency.amount.toString()),
    bookingInfo.pricing.offerCurrency.currency
  );

  const paymentValue = isGroupMode
    ? `The refundable deposit is ${formattedOfferPrice}`
    : `Your payment value is ${formattedOfferPrice}`;

  const formattedUsdPrice =
    bookingInfo.pricing.usd &&
    formatPrice(utils.parseEther(bookingInfo.pricing.usd.toString()));

  const showUSDPrice =
    formattedUsdPrice && bookingInfo.pricing.offerCurrency.currency != 'USD';

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
        minWidth: '25em'
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

      <Typography mb={{ xs: 3, lg: 2 }}>{accommodationName}</Typography>
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
      <Typography mb={{ xs: 3, lg: 2 }}>{paymentValue}</Typography>
      {showUSDPrice && (
        <Typography>Equivalent amount in USD ${formattedUsdPrice}</Typography>
      )}
    </Box>
  );
};
