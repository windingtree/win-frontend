import { queryClient } from 'src/App';
import { AccommodationsAndOffersResponse } from 'src/hooks/useAccommodationsAndOffers/api';
import { getAccommodationByProviderId } from 'src/utils/accommodation';

export const getAccommodationFromCache = (id: string | undefined) => {
  const cache = queryClient.getQueryData(['accommodations-and-offers']) as
    | AccommodationsAndOffersResponse
    | undefined;

  if (!cache || !id) return undefined;

  const accommodation = getAccommodationByProviderId(cache?.accommodations, id);
  if (!accommodation) return undefined;

  return { accommodation };
};
