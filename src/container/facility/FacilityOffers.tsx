import { useParams } from 'react-router-dom';
import { RoomCard } from 'src/components/RoomCard';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';

export const FacilityOffers = () => {
  const { getAccommodationById, getOffersById } = useAccommodationsAndOffers({});
  //TODO: refer to the correct type
  const { id } = useParams();
  const accommodation = getAccommodationById(id);
  const offers = getOffersById(id);

  return <div> jo</div>;

  //   return offers?.map((offer) => {
  //     return (
  //       <RoomCard
  //         key={offer.id}
  //         facilityId={id}
  //         offer={offer}
  //         room={
  //           accommodation.roomTypes[
  //             // @todo review after the Derbysoft Proxy types fixes
  //             offer.pricePlansReferences[id].roomType as string
  //           ]
  //         }
  //         // @todo review after the Derbysoft Proxy types fixes
  //         roomId={offer.pricePlansReferences[id].roomType as string}
  //       />
  //     );
  //   });
};
