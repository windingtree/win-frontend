import { Box, styled, Typography } from '@mui/material';
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
  const SubHeader = styled(Box)(() => ({}));
  const formattedDate = startDate && getFormattedDate(startDate);
  const roomText = rooms ? (rooms > 1 ? `${rooms} rooms, ` : '1 room, ') : '';

  return (
    <Box mb={5}>
      <Typography mb={1.5} variant="h3">
        Available Rooms
      </Typography>
      <SubHeader>
        Results for {roomText} {guests} guests, staying from {formattedDate} for {nights}{' '}
        nights.
      </SubHeader>
    </Box>
  );
};
