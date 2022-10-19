import { Box, Stack } from '@mui/material';
import { CheckoutCancellation } from './CheckoutCancellation';
import { CheckoutIntroduction } from './CheckoutIntroduction';
import { CheckoutSummary } from './CheckoutSummary';
import { CheckoutTitle } from './CheckoutTitle';

export const CheckoutOverview = () => {
  return (
    <>
      <CheckoutTitle />
      <Stack direction="row" spacing={2}>
        <CheckoutIntroduction />
        <Box>
          <CheckoutSummary />
          <CheckoutCancellation />
        </Box>
      </Stack>
    </>
  );
};
