import { Box, styled, Typography, useTheme } from '@mui/material';
import { DateTime } from 'luxon';

interface FacilityOffersTitleProps {
  rooms?: number;
  guests: number;
  startDate?: string;
  nights: number;
  roomsAvailable?: number;
}

export const FacilityOffersTitle = ({
  rooms,
  guests,
  startDate,
  nights
}: FacilityOffersTitleProps) => {
  const SubHeader = styled(Box)(() => ({}));
  const theme = useTheme();
  const dateStr =
    startDate && DateTime.fromJSDate(new Date(startDate)).toFormat('ccc, LLL d, yyyy');

  return (
    <Box mb={5}>
      <Typography mb={1.5} variant="h3">
        Available Rooms
      </Typography>
      <SubHeader>
        Results for {rooms || ''} room, {guests} guests, staying from {dateStr} for{' '}
        {nights} nights.
      </SubHeader>
    </Box>
  );
};
