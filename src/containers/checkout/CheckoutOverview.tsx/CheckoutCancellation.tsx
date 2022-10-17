import { Typography } from '@mui/material';
import { getIsRefundable } from 'src/utils/offers';

export const CheckoutCancellation = () => {
  const dummy = 'refundable_with_deadline';
  const isRefundable = getIsRefundable(dummy);
  const deadline = '3 oktober';
  const cancelationPolicy = isRefundable
    ? `Free cancellation until ${deadline}.`
    : 'Non-refundable';

  return (
    <>
      <Typography mt={2} variant="body1">
        Cancellation Policy
      </Typography>
      <Typography variant="body2">{cancelationPolicy}</Typography>
    </>
  );
};
