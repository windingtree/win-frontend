import { useParams } from 'react-router-dom';
import { RoomCard } from 'src/components/RoomCard';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';

export const FacilityOffers = () => {
  const { getAccommodationById, getOffersById, offers, accommodations } =
    useAccommodationsAndOffers();
  const params = useParams();
  const id: string = params.id as string;
  const accommodation = getAccommodationById(accommodations, id);
  const matchedOffers = getOffersById(offers, id);

  return (
    <>
      {matchedOffers.map((offer, index) => {
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
            roomId={roomId}
          />
        );
      })}
    </>
  );
};
