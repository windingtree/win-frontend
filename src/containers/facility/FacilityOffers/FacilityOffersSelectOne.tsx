import { Typography } from '@mui/material';
import { WinAccommodation } from '@windingtree/glider-types/dist/win';
import { OfferRecord } from 'src/store/types';
import { getRoomOfOffer } from 'src/utils/offers';
import { notFoundText } from '../helpers';
import { OfferItemSelectOne } from './offer-item/OfferItemSelectOne';

type FacilityOffersSelectOneProps = {
  accommodation?: WinAccommodation;
  offers?: OfferRecord[];
};
export const FacilityOffersSelectOne = ({
  accommodation,
  offers
}: FacilityOffersSelectOneProps) => {
  if (!accommodation) return null;

  if (!offers) {
    return <Typography>{notFoundText}</Typography>;
  }

  return (
    <>
      {offers?.map((offer, index) => {
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
