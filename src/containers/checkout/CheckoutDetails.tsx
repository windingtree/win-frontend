import { Typography } from '@mui/material';
import { DateTime } from 'luxon';
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

  const arrival = DateTime.fromJSDate(bookingInfo.date.arrival).toLocaleString(
    DateTime.DATE_MED
  );
  const departure = DateTime.fromJSDate(bookingInfo.date.departure).toLocaleString(
    DateTime.DATE_MED
  );

  return (
    <AccordionBox title="Your reservation details">
      {isDesktop && <Typography variant="subtitle1">Your reservation</Typography>}
      <Typography mt={2} variant="body2">
        Dates
      </Typography>
      <Typography variant="body2">{`${arrival} - ${departure}`}</Typography>
      <Typography mt={2} variant="body2">
        Room Type & Board Basis
      </Typography>
      <Typography variant="body2">
        {bookingInfo.offers[0].room?.description ?? ''}
      </Typography>

      <Typography mt={2} variant="body2">
        Guests
      </Typography>
      <Typography variant="body2">
        {`${bookingInfo.adultCount} ${bookingInfo.adultCount > 1 ? 'guests' : 'guest'}`}
      </Typography>
    </AccordionBox>
  );
};
