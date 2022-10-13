import { Box, Typography, Card } from '@mui/material';
import { CardMediaFallback } from 'src/components/CardMediaFallback';
import FallbackImage from 'src/images/hotel-fallback.webp';
import { useMemo } from 'react';
import { sortByLargestImage } from 'src/utils/accommodation';
import { useCheckout } from 'src/hooks/useCheckout';
import { getIsRefundable } from 'src/utils/offers';

export const CheckoutSummary = () => {
  const { bookingInfo } = useCheckout();
  const accommodationName = bookingInfo?.accommodation?.name;
  const accommodationImage = useMemo(() => {
    if (bookingInfo?.accommodation) {
      return sortByLargestImage(bookingInfo.accommodation.media)[0];
    }
  }, [bookingInfo]);

  const dummy = 'refundable_with_deadline';
  const isRefundable = getIsRefundable(dummy);
  const deadline = '3 oktober';
  const cancelationPolicy = isRefundable
    ? `Free cancellation until ${deadline}.`
    : 'Non-refundable';

  return (
    <Box>
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
              fallback={FallbackImage}
              alt={accommodationName}
            />
          </Card>
        </Box>
        <Box>
          <Typography>You are paying for stay in {accommodationName}</Typography>
          <Typography mt={2} variant="body2">
            {cancelationPolicy}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
