import { useParams } from 'react-router-dom';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';
import { styled } from '@mui/material';
import { Box } from '@mui/material';
import { forwardRef, useMemo } from 'react';
import { FacilityGroupOffers } from './GroupBooking/FacilityGroupOffers';
import { RoomCard } from './RoomCard';
import { getGroupMode } from 'src/hooks/useAccommodationsAndOffers.tsx/helpers';
import { FacilityOffersTitle } from './FacilityOffersTitle';
import { daysBetween } from 'src/utils/date';

const FacilityOffersContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2.5)
}));

export const FacilityOffers = forwardRef<HTMLDivElement>((_, ref) => {
  const { getAccommodationById, accommodations, latestQueryParams } =
    useAccommodationsAndOffers();
  const params = useParams();
  const id: string = params.id as string;
  const accommodation = useMemo(
    () => getAccommodationById(accommodations, id),
    [accommodations, id]
  );
  const guests =
    (latestQueryParams?.adultCount ?? 0) + (latestQueryParams?.childrenCount ?? 0);
  const nights = daysBetween(latestQueryParams?.arrival, latestQueryParams?.departure);
  const roomCount = latestQueryParams?.roomCount;
  const isGroupMode = getGroupMode(roomCount);

  //TODO: put this in useAccommodationsAndOffers hook
  const sortedOffers =
    accommodation &&
    [...accommodation.offers].sort((prevOffer, nextOffer) => {
      return Number(prevOffer.price.public) - Number(nextOffer.price.public);
    });

  return (
    <FacilityOffersContainer ref={ref}>
      {isGroupMode && (
        <FacilityGroupOffers offers={sortedOffers} accommodation={accommodation} />
      )}
      {!isGroupMode && (
        <>
          <FacilityOffersTitle
            rooms={roomCount}
            guests={guests}
            startDate={latestQueryParams?.arrival?.toUTCString()}
            nights={nights}
            roomsAvailable={accommodation?.offers?.length ?? 0}
          />

          {sortedOffers?.map((offer, index) => {
            //TODO: move this to the use accommodations hook
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
        </>
      )}
    </FacilityOffersContainer>
  );
});
