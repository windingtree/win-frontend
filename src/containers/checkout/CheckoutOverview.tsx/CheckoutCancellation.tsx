import { Typography } from '@mui/material';
import { useCheckout } from 'src/hooks/useCheckout';
import { getFormattedDate } from 'src/utils/date';
import { getIsRefundable } from 'src/utils/offers';

export const CheckoutCancellation = () => {
  const { bookingInfo, bookingMode } = useCheckout();
  const isNormalMode = bookingMode === 'normal';

  if (!isNormalMode || !bookingInfo?.offers) return null;

  const refundability = bookingInfo?.offers[0]?.refundability;

  //TODO: this line can be eventually removed if the type becomes required  after BE changes.
  if (!refundability) return null;

  const isRefundable = getIsRefundable(refundability?.type);
  const deadline = refundability?.deadline && getFormattedDate(refundability?.deadline);

  return (
    <>
      <Typography mt={2} variant="body1">
        Cancellation Policy
      </Typography>

      {isRefundable && (
        <Typography variant="body2">
          This is a <b>free cancellation</b> reservation untill {deadline}. Fees apply if
          cancellation takes place after that date.
        </Typography>
      )}

      {!isRefundable && (
        <Typography variant="body2">
          Please notice: once you pay for this booking, you cannot get any refund
        </Typography>
      )}
    </>
  );
};
