import { useParams } from 'react-router-dom';
import { RoomCard } from 'src/components/RoomCard';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';
import { styled, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/material';
import { forwardRef } from 'react';
import { daysBetween } from '../../utils/date';

interface SearchCriteriaAndResult {
  rooms?: number;
  guests: number;
  startDate?: string;
  nights: number;
  roomsAvailable?: number;
}

const FacilityOffersContainer = styled(Box)(({ theme }) => ({
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
  const dateStr = startDate && new Date(startDate).toDateString();

  return (
    <Box marginBottom={theme.spacing(2.5)}>
      <Typography marginBottom={theme.spacing(6)}>Available Rooms</Typography>
      <SubHeader>
        Results for {rooms || ''} room, {guests} guests, staying from {dateStr} for{' '}
        {nights} nights: {roomsAvailable} room(s) available.
      </SubHeader>
    </Box>
  );
};

export const FacilityOffers = forwardRef<HTMLDivElement>((_, ref) => {
  const { getAccommodationById, accommodations, latestQueryParams } =
    useAccommodationsAndOffers();
  const params = useParams();
  const id: string = params.id as string;
  const accommodation = getAccommodationById(accommodations, id);
  const guests =
    (latestQueryParams?.adultCount ?? 0) + (latestQueryParams?.childrenCount ?? 0);
  const nights = daysBetween(latestQueryParams?.arrival, latestQueryParams?.departure);

  return (
    <FacilityOffersContainer ref={ref}>
      <FacilityOffersTitle
        rooms={latestQueryParams?.roomCount}
        guests={guests}
        startDate={latestQueryParams?.arrival?.toUTCString()}
        nights={nights}
        roomsAvailable={accommodation?.offers?.length ?? 0}
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
