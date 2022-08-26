import { useParams } from 'react-router-dom';
import { RoomCard } from 'src/components/RoomCard';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';
import { styled, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/material';
import { forwardRef } from 'react';

interface SearchCriteriaAndResult {
  rooms?: number;
  guests: number;
  startDate: string;
  nights: number;
  roomsAvailable?: number;
}

const FacilityOffersContainer = styled(Box)(({theme}) => ({
  marginBottom: theme.spacing(2.5),
  padding: theme.spacing(2.5)
}));

const FacilityOffersTitle = ({
  rooms,
  roomsAvailable,
  guests,
  startDate,
  nights
}: SearchCriteriaAndResult) => {

  const SubHeader = styled(Box)(() => ({}));
  const theme = useTheme();

  return (
    <Box marginBottom={theme.spacing(2.5)}>
      <Typography marginBottom={theme.spacing(6)}>Available Rooms</Typography>
      <SubHeader>
        Results for {rooms || ''} room, {guests} guests, staying from {startDate} for{' '}
        {nights} nights: {roomsAvailable} rooms available.
      </SubHeader>
    </Box>
  );
};

export const FacilityOffers = forwardRef<HTMLDivElement>((_, ref) => {
  const { getAccommodationById, accommodations } = useAccommodationsAndOffers();
  const params = useParams();
  const id: string = params.id as string;
  const accommodation = getAccommodationById(accommodations, id);

  return (
    <FacilityOffersContainer ref={ref}>
      <FacilityOffersTitle
        rooms={1}
        guests={2}
        startDate={new Date().toUTCString()}
        nights={2}
        roomsAvailable={accommodation?.offers?.length}
      />
      {accommodation?.offers.map((offer, index) => {
        //TODO: revise whether we maybe want to restructure the data in such a way that is more intuitive
        // pricePlanReferences has a key that refers to the accommodationId, which can be confusing.
        const accommodationOfOffer = Object.values(offer.pricePlansReferences)[0];
        const roomId: string = accommodationOfOffer?.roomType || '';
        const rooms = accommodation?.roomTypes || {};
        const matchedRoomWithOffer = rooms[roomId];

        return (
          <RoomCard
            key={index}
            facilityId={id}
            offer={offer}
            room={matchedRoomWithOffer}
          />
        );
      })}
    </FacilityOffersContainer>
  );
});
