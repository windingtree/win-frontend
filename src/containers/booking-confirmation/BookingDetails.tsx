import { useSearchParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { ExternalLink } from 'src/components/ExternalLink';
import { useAppState } from 'src/store';

export const BookingDetails = () => {
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
