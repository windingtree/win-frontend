import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers';
import { sortAccommodationOffersByPrice } from 'src/utils/accommodation';
import { getRoomOfOffer } from 'src/utils/offers';
import { OfferItemSelectOne } from './offer-item/OfferItemSelectOne';

export const FacilityOffersSelectOne = () => {
  const { getAccommodationById, accommodations, latestQueryParams } =
    useAccommodationsAndOffers();
  const params = useParams();
  const id: string = params.id as string;

  const accommodation = useMemo(
    () => getAccommodationById(accommodations, id),
    [accommodations, id, getAccommodationById]
  );

  if (!latestQueryParams || !accommodation) return null;

  const offers = sortAccommodationOffersByPrice(accommodation);

  return (
    <>
      {offers?.map((offer, index) => {
        const room = getRoomOfOffer(accommodation, offer);

        return (
          <OfferItemSelectOne key={index} facilityId={id} offer={offer} room={room} />
        );
      })}
    </>
  );
};
