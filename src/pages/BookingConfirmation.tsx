import { BookingDetails } from 'src/containers/booking-confirmation/BookingDetails';
import { BookingRewards } from 'src/containers/booking-confirmation/BookingRewards';
import { DevconCashbackReward } from '../containers/booking-confirmation/DevconCashbackReward';
import MainLayout from 'src/layouts/main';

export const BookingConfirmation = () => (
  <MainLayout maxWidth="md">
    <BookingDetails />
    <BookingRewards />
    <DevconCashbackReward />
  </MainLayout>
);
