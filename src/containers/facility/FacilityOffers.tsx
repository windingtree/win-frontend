import { useParams } from 'react-router-dom';
import { RoomCard } from 'src/containers/facility/RoomCard/RoomCard';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';
import { styled, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/material';
import { forwardRef } from 'react';
import { daysBetween } from '../../utils/date';
import { DateTime } from 'luxon';
import { FacilityGroupOffers } from './FacilityGroupOffers';

interface SearchCriteriaAndResult {
  rooms?: number;
  guests: number;
  startDate?: string;
  nights: number;
  roomsAvailable?: number;
}

const FacilityOffersContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2.5)
}));

const FacilityOffersTitle = ({
  rooms,
  guests,
  startDate,
  nights
}: SearchCriteriaAndResult) => {
  const SubHeader = styled(Box)(() => ({}));
  const theme = useTheme();
  const dateStr =
    startDate && DateTime.fromJSDate(new Date(startDate)).toFormat('ccc, LLL d, yyyy');

  return (
    <Box mb={theme.spacing(5)}>
      <Typography mb={theme.spacing(1.5)} variant={'h3'}>
        Available Rooms
      </Typography>
      <SubHeader>
        Results for {rooms || ''} room, {guests} guests, staying from {dateStr} for{' '}
        {nights} nights.
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
  const roomCount = latestQueryParams?.roomCount;
  //TODO: determine whether it is a group booking
  // const showGroupBooking = roomCount && roomCount > 9;
  const showGroupBooking = true;

  //TODO: put this in useAccommodationsAndOffers hook
  const sortedOffers =
    accommodation &&
    [...accommodation.offers].sort((prevOffer, nextOffer) => {
      return Number(prevOffer.price.public) - Number(nextOffer.price.public);
    });

  return (
    <FacilityOffersContainer ref={ref}>
      <FacilityOffersTitle
        rooms={roomCount}
        guests={guests}
        startDate={latestQueryParams?.arrival?.toUTCString()}
        nights={nights}
        roomsAvailable={accommodation?.offers?.length ?? 0}
      />

      {showGroupBooking && (
        <FacilityGroupOffers
          offers={sortedOffers}
          accommodation={accommodation}
          facilityId={id}
        />
      )}
      {!showGroupBooking &&
        sortedOffers?.map((offer, index) => {
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
