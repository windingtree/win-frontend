import { Box } from '@mui/material';
import { CheckoutIntroduction } from './CheckoutIntroduction';
import { CheckoutSummary } from './CheckoutSummary';

export const CheckoutOverview = () => {
  return (
    <Box>
      <CheckoutIntroduction />
      <CheckoutSummary />
    </Box>
  );
};
