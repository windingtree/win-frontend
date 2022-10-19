import { Box, Typography } from '@mui/material';
import { getFormattedDate } from 'src/utils/date';

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
  const formattedDate = startDate && getFormattedDate(startDate);
  const roomText = rooms ? (rooms > 1 ? `${rooms} rooms, ` : '1 room, ') : '';

  return (
    <Box>
      <Typography mb={1.5} variant="h3">
        Available Rooms
      </Typography>
      <Typography>
        Results for {roomText} {guests} guests, staying from {formattedDate} for {nights}{' '}
        nights.
      </Typography>
    </Box>
  );
};
