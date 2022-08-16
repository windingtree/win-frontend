import { useParams } from 'react-router-dom';
import { RoomCard } from 'src/components/RoomCard';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';

export const FacilityOffers = () => {
  const { getAccommodationById, getOffersById, offers, accommodations } =
    useAccommodationsAndOffers({});
  //TODO: refer to the correct type
  const { id } = useParams();
  const accommodation = getAccommodationById(accommodations, id);
  const matchedOffers = getOffersById(offers, id);

  return matchedOffers?.map((offer) => {
    //TODO: revise whether we maybe want to restructure the data in such a way that is more intuitive
    // pricePlanReferences has a key that refers to the accommodationId, which can be confusing.
    const accommodationOfOffer = Object.values(offer.pricePlansReferences)[0];
    const roomId = accommodationOfOffer?.roomType;
    const rooms = accommodation?.roomTypes;
    const matchedRoomWithOffer = rooms[roomId];

    return (
      <RoomCard
        key={offer.id}
        facilityId={id}
        offer={offer}
        room={matchedRoomWithOffer}
        roomId={roomId}
      />
    );
  });
};
