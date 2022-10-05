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

  return (
    <Box mb={5}>
      <Typography mb={1.5} variant="h3">
        Available Rooms
      </Typography>
      <SubHeader>
        Results for {rooms || 0} room, {guests} guests, staying from {formattedDate} for{' '}
        {nights} nights.
      </SubHeader>
    </Box>
  );
};
