import { Box, styled, Typography } from '@mui/material';
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
  const dateStr =
    startDate && DateTime.fromJSDate(new Date(startDate)).toFormat('ccc, LLL d, yyyy');
  const roomText = rooms ? (rooms > 1 ? `${rooms} rooms, ` : '1 room, ') : '';
  return (
    <Box mb={5}>
      <Typography mb={1.5} variant="h3">
        Available Rooms
      </Typography>
      <SubHeader>
        Results for {roomText} {guests} guests, staying from {dateStr} for {nights}{' '}
        nights.
      </SubHeader>
    </Box>
  );
};
