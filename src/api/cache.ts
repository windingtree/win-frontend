import { queryClient } from 'src/App';
import { SearchPropsType } from 'src/hooks/useAccommodationSingle';
import { getAccommodationByProviderId } from 'src/utils/accommodation';
import { getOffersById } from 'src/utils/offers';
import { OffersResponseType } from './AccommodationOffers';
import { AccommodationsAndOffersResponse } from './AccommodationsAndOffers';

export const getAccommodationFromCache = (id: string | undefined) => {
  const cache = queryClient.getQueryData(['accommodations-and-offers']) as
    | AccommodationsAndOffersResponse
    | undefined;

  if (!cache || !id) return undefined;

  const accommodation = getAccommodationByProviderId(cache?.accommodations, id);
  if (!accommodation) return undefined;

  return { accommodation };
};

/**
 * Check if the properties that are used in the latest are the same as the ones from the previous search.
 */
const isSearchPropsFromCacheValid = (cache, searchProps: SearchPropsType) => {
  const { latestQueryParams } = cache;

  if (
    searchProps.adultCount === latestQueryParams.adultCount ||
    searchProps.arrival === latestQueryParams.arrival ||
    searchProps.departure === latestQueryParams.departure ||
    searchProps.roomCount === latestQueryParams.roomCount
  ) {
    return true;
  }

  return false;
};

export const getAccommodationAndOffersFromCache = (
  providerId?: string,
  searchProps?: SearchPropsType
): OffersResponseType | undefined => {
  const cache = queryClient.getQueryData(['accommodations-and-offers']) as
    | AccommodationsAndOffersResponse
    | undefined;

  if (!cache || !providerId || !searchProps) return undefined;

  if (!isSearchPropsFromCacheValid(cache, searchProps)) return undefined;

  const accommodation = getAccommodationByProviderId(cache?.accommodations, providerId);

  if (!accommodation) return undefined;

  const matchedOffers = getOffersById(cache.offers, accommodation.id);

  return {
    accommodations: { [accommodation.id]: accommodation },
    offers: matchedOffers,
    latestQueryParams: searchProps
  };
};
