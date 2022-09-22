import { BookingDetails } from 'src/containers/booking-confirmation/BookingDetails';
import { BookingRewards } from 'src/containers/booking-confirmation/BookingRewards';
import MainLayout from 'src/layouts/main';
import {DevconCashbackReward} from "../containers/booking-confirmation/DevconCashbackReward";

export const BookingConfirmation = () => {
  return (
    <MainLayout maxWidth="md">
      <BookingDetails />
      <BookingRewards />
      <DevconCashbackReward />
    </MainLayout>
  );
};
