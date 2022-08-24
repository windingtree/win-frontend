import MainLayout from 'src/layouts/main';
import { Box, Link, Typography } from '@mui/material';

export const BookingConfirmation = () => {
  return (
    <MainLayout>
      <Box sx={{ width: '100%', maxWidth: 600 }} alignSelf='center'>
        <Typography variant='h4'>
          Your booking was successful
        </Typography>
        <Typography variant='body1'>
          Thanks for booking with win.so. We have send an email with all the details
          about your booking. If you have any questions about the booking, you can
          contact the hotel through the contact details provided in the email.
        </Typography>
        <Typography variant='body1'>
          What was your experience with the booking process?&nbsp;
          <Link 
            variant='button'
            href='https://winwindao.typeform.com/win-feedback'
            target='_blank'
            rel='noopener'
            >
              Give Feedback
          </Link>
        </Typography>
        
      </Box>
    </MainLayout>
  );
};
