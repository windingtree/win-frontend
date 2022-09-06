import { BookingDetails } from 'src/containers/booking-confirmation/BookingDetails';
import { BookingRewards } from 'src/containers/booking-confirmation/BookingRewards';
import MainLayout from 'src/layouts/main';

export const BookingConfirmation = () => {
  return (
    <MainLayout maxWidth="sm">
      <BookingDetails />
      <BookingRewards />
    </MainLayout>
  );
};
