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
    const accommodationOfOffer = Object.values(offer.pricePlansReferences)[0];
    // get the id ofer the roomTypes of the offer

    console.log('offer', offer);
    const roomId = accommodationOfOffer?.roomType;

    // get the room by passing the id of the roomTypes to the roomTypes of accommodations
    const rooms = accommodation?.roomTypes;

    return (
      <RoomCard
        key={offer.id}
        facilityId={id}
        offer={offer}
        room={rooms[0]}
        roomId={roomId}
      />
    );
  });
};
