import { Box, Button, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { HEADER } from 'src/config/componentSizes';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';
import { daysBetween } from 'src/utils/date';

const calculateRoomCount = () => {};

export const FacilityGroupOffersSummary = () => {
  const { watch } = useFormContext();
  const totalPrice = '2540';
  const { latestQueryParams } = useAccommodationsAndOffers();
  const arrival = latestQueryParams?.arrival;
  const departure = latestQueryParams?.departure;
  const numberOfNights = daysBetween(arrival, departure);
  const guests =
    (latestQueryParams?.adultCount ?? 0) + (latestQueryParams?.childrenCount ?? 0);
  const values = watch();
  const roomCount = values.reduce((prev, current) => Number(current.quantity) + prev, 0);

  console.log('roomCount', roomCount);
  return (
    <Box sx={{ position: { md: 'sticky' }, top: { md: HEADER.MAIN_DESKTOP_HEIGHT } }}>
      {/* //TODO: calculate the total amount of nights and adults */}
      <Typography>{`Total Price for ${numberOfNights} nights per ${roomCount} rooms and ${guests} guests`}</Typography>
      <Typography variant="h5">{totalPrice}</Typography>
      <Typography variant="body2" mb={2}>
        Estimated price
      </Typography>
      <Typography variant="caption">
        You will have to pay a deposit value 10% from the estimated price. In case you do
        not proceed with our offer you will be eligible for a full refund. Read more about
        this process here Deposit policy & Refund{' '}
      </Typography>
      {/* TODO: on submit store the offers in a state */}
      <Button variant="contained" fullWidth sx={{ mt: 1 }} size="large">
        Request a quotation
      </Button>
    </Box>
  );
};
