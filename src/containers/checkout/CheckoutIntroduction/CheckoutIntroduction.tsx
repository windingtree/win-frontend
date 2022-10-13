import { utils } from 'ethers';
import { Box, Typography } from '@mui/material';
import { formatPrice } from 'src/utils/strings';
import { useCheckout } from 'src/hooks/useCheckout';

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

  return (
    <Box mb={{ xs: 3, lg: 5 }}>
      <Typography variant="h4">{title}</Typography>
      {showUSDPrice && <Typography variant="h5">{subTitle}</Typography>}

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
    </Box>
  );
};
