import { Typography } from '@mui/material';
import { AccordionBox } from 'src/components/AccordionBox';
import { useCheckout } from 'src/hooks/useCheckout';
import { useResponsive } from 'src/hooks/useResponsive';

export const CheckoutDetails = () => {
  const { bookingInfo, bookingMode } = useCheckout();
  const isNormalMode = bookingMode === 'normal';
  const isDesktop = useResponsive('up', 'md');

  if (
    !isNormalMode ||
    !bookingInfo ||
    !bookingInfo.offers ||
    !bookingInfo.adultCount ||
    !bookingInfo.date
  )
    return null;

  // const refundability = bookingInfo?.offers[0]?.refundability;
  console.log('bookingInfo', bookingInfo);
  //TODO: this line can be eventually removed if the type becomes required  after BE changes.
  // if (!refundability) return null;

  // const isRefundable = getIsRefundable(refundability?.type);
  // const deadline = refundability?.deadline && getFormattedDate(refundability?.deadline);

  return (
    <AccordionBox title="Your reservation details">
      {isDesktop && <Typography variant="subtitle1">Your reservation</Typography>}
      <Typography mt={2} variant="body2">
        Dates
      </Typography>
      <Typography variant="body2">{`${bookingInfo.date.arrival} - ${bookingInfo.date.departure}`}</Typography>

      <Typography mt={2} variant="body2">
        Room Type & Board Basis
      </Typography>
      <Typography variant="body2">
        {bookingInfo.offers[0].room?.description ?? ''}
      </Typography>

      <Typography mt={2} variant="body2">
        Guests
      </Typography>
      <Typography variant="body2">{`${bookingInfo.adultCount} ${
        bookingInfo.adultCount > 1 ? 'guests' : 'guest'
      }`}</Typography>
    </AccordionBox>
  );
};
