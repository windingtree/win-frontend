import MainLayout from 'src/layouts/main';
import { Box, Text } from 'grommet';

export const BookingConfirmation = () => {
  return (
    <MainLayout>
      <Box align="center" width="100%">
        <Box style={{ maxWidth: '480px' }}>
          <Text margin={{ bottom: '8px' }} size="xlarge">
            Your booking was successful
          </Text>
          <Text>
            Thanks for booking with win.so. We have send an email with all the details
            about your booking. If you have any questions about the booking, you can
            contact the hotel through the contact details provided in the email.
          </Text>
        </Box>
      </Box>
    </MainLayout>
  );
};
