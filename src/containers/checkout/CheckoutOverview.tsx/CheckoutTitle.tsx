import { Box, Typography } from '@mui/material';
import { useCheckout } from 'src/hooks/useCheckout';

export const CheckoutTitle = () => {
  const { bookingMode } = useCheckout();
  const isGroupMode = bookingMode === 'group' ? true : false;

  return (
    <Box mb={{ xs: 3, lg: 5 }}>
      <Typography variant="h4">Proceed with payment</Typography>

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
