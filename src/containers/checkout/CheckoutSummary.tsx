import { utils } from 'ethers';
import { Box, Typography, Card } from '@mui/material';
import { formatPrice } from 'src/utils/strings';
import { useAppState } from 'src/store';
import { CardMediaFallback } from 'src/components/CardMediaFallback';
import FallbackImage from 'src/images/hotel-fallback.webp';

import { useMemo } from 'react';
import { sortByLargestImage } from 'src/utils/accommodation';
import { useCheckout } from 'src/hooks/useCheckout/useCheckout';
import { Link } from 'react-router-dom';

export const CheckoutSummary = () => {
  const { bookingMode, bookingInfo } = useCheckout();
  const isGroupMode = bookingMode === 'group' ? true : false;
  const accommodationName = bookingInfo?.accommodation?.name;
  const { account } = useAppState();

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

  return (
    <Box>
      {!account && (
        <Typography variant="h3" mb={3}>
          Please connect your wallet to proceed with the Payment
        </Typography>
      )}
      <Box textAlign={{ xs: 'center', lg: 'left' }} mb={{ xs: 3, lg: 5 }}>
        <Box
          sx={{
            display: 'inline-block'
          }}
        >
          <Typography variant="h3">{title}</Typography>
          {showUSDPrice && (
            <Typography variant="h5" textAlign={{ xs: 'center', lg: 'right' }}>
              {subTitle}
            </Typography>
          )}

          {isGroupMode && (
            <Typography textAlign={{ xs: 'center', lg: 'right' }}>
              This 10% deposit is required to pre-book the rooms and get the best offer
              from the hotel. You can get it back anytime. Check out the{' '}
              <Link to="faq">group booking guide</Link>.
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
        <Box mr={{ xs: 0, lg: 5 }} mb={{ xs: 3, lg: 0 }}>
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
        <Box>
          <Typography>You are paying for stay in {accommodationName}</Typography>
        </Box>
      </Box>
    </Box>
  );
};
