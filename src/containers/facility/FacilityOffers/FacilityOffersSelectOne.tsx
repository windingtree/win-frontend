import { Typography } from '@mui/material';
import { WinAccommodation } from '@windingtree/glider-types/dist/win';
import { OfferRecord } from 'src/store/types';
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
        return (
          <OfferItemSelectOne key={index} accommodation={accommodation} offer={offer} />
        );
      })}
    </>
  );
};
