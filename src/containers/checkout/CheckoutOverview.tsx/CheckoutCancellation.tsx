import { Typography } from '@mui/material';
import { useCheckout } from 'src/hooks/useCheckout';
import { getFormattedDate } from 'src/utils/date';
import { getIsRefundable } from 'src/utils/offers';

export const CheckoutCancellation = () => {
  const { bookingInfo, bookingMode } = useCheckout();
  const isNormalMode = bookingMode === 'normal';

  if (!isNormalMode || !bookingInfo?.offers) return null;
  const offer = bookingInfo.offers[0];
  const isRefundable = getIsRefundable(offer.refundability?.type);
  const deadline =
    offer.refundability?.deadline && getFormattedDate(offer.refundability?.deadline);
  const cancelationPolicy = isRefundable
    ? `Free cancellation until ${deadline}. Fees apply if cancellation takes place after that date`
    : 'Please notice: once you pay for this booking, you cannot get any refund.';

  return (
    <>
      <Typography mt={2} variant="body1">
        Cancellation Policy
      </Typography>
      <Typography variant="body2">{cancelationPolicy}</Typography>
    </>
  );
};
