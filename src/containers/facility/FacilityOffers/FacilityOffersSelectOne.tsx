import { Typography } from '@mui/material';
import { WinAccommodation } from '@windingtree/glider-types/dist/win';
import { OfferRecord } from 'src/store/types';
import { notFoundText } from '../helpers';
import { OfferItemSelectOne } from './offer-item/OfferItemSelectOne';

type FacilityOffersSelectOneProps = {
  accommodation?: WinAccommodation;
  offers?: OfferRecord[];
  roomCount?: number;
  arrival?: Date | null;
  departure?: Date | null;
  adultCount?: number;
};
export const FacilityOffersSelectOne = ({
  accommodation,
  offers,
  adultCount,
  arrival,
  departure,
  roomCount
}: FacilityOffersSelectOneProps) => {
  if (!accommodation || !offers || !arrival || !departure || !adultCount || !roomCount) {
    return null;
  }

  if (Array.isArray(offers) && !offers.length) {
    return <Typography>{notFoundText}</Typography>;
  }

  return (
    <>
      {offers?.map((offer, index) => {
        return (
          <OfferItemSelectOne
            key={index}
            accommodation={accommodation}
            offer={offer}
            adultCount={adultCount}
            arrival={arrival}
            departure={departure}
            roomCount={roomCount}
          />
        );
      })}
    </>
  );
};
