import { useSearchParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { ExternalLink } from 'src/components/ExternalLink';
import { useAppState } from 'src/store';
import { useCheckout } from '../../hooks/useCheckout/useCheckout';
import { getFormattedDate } from 'src/utils/date';

export const BookingDetails = () => {
  const { bookingMode } = useCheckout();
  const isGroupMode = bookingMode === 'group';
  return isGroupMode ? <GroupBookingDetails /> : <IndividualBookingDetails />;
};

const IndividualBookingDetails = () => {
  const { selectedNetwork } = useAppState();
  const [params] = useSearchParams();
  return (
    <Box mt={4}>
      <Typography variant="h3" component="h1" mb={1}>
        Booking confirmed 🥳
      </Typography>
      <Typography variant="body1">
        Your{' '}
        <ExternalLink
          href={`${selectedNetwork?.blockExplorer}/tx/${params.get('tx')}`}
          target="_blank"
        >
          transaction
        </ExternalLink>{' '}
        and booking was successful. Your booking confirmation will be sent by email. Thank
        you for booking using win.so!
      </Typography>
    </Box>
  );
};

const GroupBookingDetails = () => {
  const { selectedNetwork } = useAppState();
  const [params] = useSearchParams();
  const { bookingInfo } = useCheckout();
  const depositAmount = `${bookingInfo?.pricing?.offerCurrency.amount || ''} ${
    bookingInfo?.pricing?.offerCurrency.currency || ''
  }`;
  const guests = bookingInfo?.adultCount || '';
  const rooms = bookingInfo?.roomCount || '';
  const hotelName = bookingInfo?.accommodation?.name || '';
  const departureDate = bookingInfo?.date?.departure || '';
  const arrivalDate = bookingInfo?.date?.arrival || '';
  return (
    <Box mt={4}>
      <Typography variant="h4" component="h1" mb={1}>
        Your{' '}
        <ExternalLink
          href={`${selectedNetwork?.blockExplorer}/tx/${params.get('tx')}`}
          target="_blank"
        >
          transaction
        </ExternalLink>{' '}
        is confirmed 🥳
      </Typography>

      <Typography variant="body1">
        Please check your email with all the details.
        <div />
        Within the next 24 hours we will get back to you with the best offer for your stay
        in {`${hotelName}`}
      </Typography>
      <Typography variant="body1" pt={2}>
        Your deposit amount is {`${depositAmount}`} for your stay in {`${hotelName}`},
        from {`${getFormattedDate(departureDate)}`} untill{' '}
        {`${getFormattedDate(arrivalDate)}`} for {`${guests}`} adults and {`${rooms}`}{' '}
        rooms
        <div />
      </Typography>
      <Typography variant="body1" pt={2}>
        Thank you for booking with win.so!
      </Typography>
    </Box>
  );
};
