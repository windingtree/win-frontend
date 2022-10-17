import { utils } from 'ethers';
import { Box, Card, Typography } from '@mui/material';
import { formatPrice } from 'src/utils/strings';
import { useCheckout } from 'src/hooks/useCheckout';
import { sortByLargestImage } from 'src/utils/accommodation';
import { useMemo } from 'react';
import { CardMediaFallback } from 'src/components/CardMediaFallback';
import FallbackImage from 'src/images/hotel-fallback.webp';

export const CheckoutIntroduction = () => {
  const { bookingMode, bookingInfo } = useCheckout();
  const isGroupMode = bookingMode === 'group' ? true : false;

  if (!bookingInfo?.pricing) return null;

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

  const accommodationName = bookingInfo?.accommodation?.name;
  const accommodationImage = useMemo(() => {
    if (bookingInfo?.accommodation) {
      return sortByLargestImage(bookingInfo.accommodation.media)[0];
    }
  }, [bookingInfo]);

  return (
    <Box mb={{ xs: 3, lg: 5 }}>
      <Typography>{title}</Typography>
      {showUSDPrice && <Typography>{subTitle}</Typography>}

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

      <Box>
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
      <Typography>You are paying for stay in {accommodationName}</Typography>
    </Box>
  );
};
