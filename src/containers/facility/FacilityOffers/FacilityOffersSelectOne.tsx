import { WinAccommodation } from '@windingtree/glider-types/dist/win';
import { OfferRecord } from 'src/store/types';
import { sortAccommodationOffersByPrice } from 'src/utils/accommodation';
import { getRoomOfOffer } from 'src/utils/offers';
import { OfferItemSelectOne } from './offer-item/OfferItemSelectOne';

type FacilityOffersSelectOneProps = {
  accommodation?: WinAccommodation;
  offers?: OfferRecord[];
};
export const FacilityOffersSelectOne = ({
  accommodation,
  offers
}: FacilityOffersSelectOneProps) => {
  if (!offers || !accommodation) return null;

  return (
    <>
      {offers?.map((offer, index) => {
        console.log('ACC', accommodation, offer);
        const room = getRoomOfOffer(accommodation.roomTypes, offer);

        return (
          <OfferItemSelectOne
            key={index}
            accommodation={accommodation}
            offer={offer}
            room={room}
          />
        );
      })}
    </>
  );
};
