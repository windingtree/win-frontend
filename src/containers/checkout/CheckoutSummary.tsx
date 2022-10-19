import { utils } from 'ethers';
import { Box, Typography, Card } from '@mui/material';
import { formatPrice } from 'src/utils/strings';
import { CardMediaFallback } from 'src/components/CardMediaFallback';
import { useMemo } from 'react';
import { sortByLargestImage } from 'src/utils/accommodation';
import { useCheckout } from 'src/hooks/useCheckout';

export const CheckoutSummary = () => {
  const { bookingMode, bookingInfo } = useCheckout();
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

          {isGroupMode && (
            <>
              <Typography mt={2}>
                This 10% deposit is required to pre-book the rooms and get the best offer
                from the hotel. <b>You can get it back anytime.</b>
              </Typography>

              <Typography>
                Check out the group booking
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://blog.windingtree.com/how-to-group-book-with-win-841cf9411427"
                >
                  guide
                </a>
                .
              </Typography>
            </>
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
