import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers';
import { sortAccommodationOffersByPrice } from 'src/utils/accommodation';
import { daysBetween } from 'src/utils/date';
import { getRoomOfOffer } from 'src/utils/offers';
import { FacilityOffersTitle } from './FacilityOffersTitle';
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

  const { arrival, departure, adultCount, childrenCount, roomCount } = latestQueryParams;
  const guests = (adultCount ?? 0) + (childrenCount ?? 0);
  const nights = daysBetween(arrival, departure);
  const offers = sortAccommodationOffersByPrice(accommodation);

  return (
    <>
      <FacilityOffersTitle
        rooms={roomCount}
        guests={guests}
        startDate={arrival?.toUTCString()}
        nights={nights}
        roomsAvailable={accommodation?.offers?.length ?? 0}
      />

      {offers?.map((offer, index) => {
        const room = getRoomOfOffer(accommodation, offer);

        return (
          <OfferItemSelectOne key={index} facilityId={id} offer={offer} room={room} />
        );
      })}
    </>
  );
};
