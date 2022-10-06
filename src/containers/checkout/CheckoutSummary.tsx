import { utils } from 'ethers';
import { Box, Typography, Card } from '@mui/material';
import { formatPrice } from 'src/utils/strings';
import { useAppState } from 'src/store';
import { CardMediaFallback } from 'src/components/CardMediaFallback';
import FallbackImage from 'src/images/hotel-fallback.webp';
import { MediaItem } from '@windingtree/glider-types/dist/win';
import { Payment } from 'src/components/PaymentCard';

interface CheckoutSummaryProps {
  payment: Payment;
  accommodationName: string | undefined;
  accommodationImage: MediaItem | undefined;
}
export const CheckoutSummary = ({
  payment,
  accommodationName,
  accommodationImage
}: CheckoutSummaryProps) => {
  const { account } = useAppState();

  return (
    <Box>
      {!account && (
        <Typography variant="h3" mb={3}>
          Please connect your wallet to proceed with the Payment
        </Typography>
      )}
      <Box textAlign={{ xs: 'center', lg: 'left' }} mb={{ xs: 3, lg: 5 }}>
        <Box
          sx={{
            display: 'inline-block'
          }}
        >
          <Typography variant="h3">
            Your payment value is&nbsp;
            {formatPrice(payment.value, payment.currency)}
          </Typography>
          {payment?.quote && (
            <Typography variant="h5" textAlign={{ xs: 'center', lg: 'right' }}>
              Equivalent to&nbsp;
              {formatPrice(
                utils.parseEther(payment.quote.sourceAmount.toString()),
                payment.quote.sourceCurrency
              )}
            </Typography>
          )}
        </Box>
      </Box>

      <Box
        flexDirection={{ xs: 'column', lg: 'row' }}
        sx={{
          display: 'flex',
          alignItems: 'center',
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
        </Box>
      </Box>
    </Box>
  );
};
