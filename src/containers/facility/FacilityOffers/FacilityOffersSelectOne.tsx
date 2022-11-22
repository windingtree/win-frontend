import { Typography } from '@mui/material';
import { WinAccommodation } from '@windingtree/glider-types/dist/win';
import { SearchPropsType } from 'src/hooks/useAccommodationSingle';
import { OfferRecord } from 'src/store/types';
import { notFoundText } from '../helpers';
import { OfferItemSelectOne } from './offer-item/OfferItemSelectOne';

type FacilityOffersSelectOneProps = {
  accommodation?: WinAccommodation;
  offers?: OfferRecord[];
  latestQueryParams?: SearchPropsType;
};
export const FacilityOffersSelectOne = ({
  accommodation,
  offers,
  latestQueryParams
}: FacilityOffersSelectOneProps) => {
  if (!accommodation || !offers || !latestQueryParams) {
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
            latestQueryParams={latestQueryParams}
          />
        );
      })}
    </>
  );
};
