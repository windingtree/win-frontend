import { Offer, WinAccommodation } from '@windingtree/glider-types/dist/win';
import { useCallback } from 'react';
import { OfferRecord } from '../../store/types';
import { CurrencyCode, useCurrencies } from '../useCurrencies';
import { useUserSettings } from '../useUserSettings';
import { AccommodationWithId } from './helpers';

export const useAccommodationsAndOffersHelpers = () => {
  const { convertPriceCurrency } = useCurrencies();
  const { preferredCurrencyCode } = useUserSettings();

  // attach price in preferred currency to array of offers
  const getOffersWithPreferredCurrency = (
    offers: OfferRecord[],
    preferredCurrencyCode: CurrencyCode
  ): OfferRecord[] => {
    return offers.map((offer) => {
      const preferredCurrencyPrice = convertPriceCurrency({
        price: offer.price,
        targetCurrency: preferredCurrencyCode
      });

      return { ...offer, preferredCurrencyPrice };
    });
  };

  // normalize offers hook
  const normalizeOffers = useCallback(
    (offers: Record<string, Offer>): OfferRecord[] => {
      if (!offers) return [];

      const normalizedData = Object.entries(offers).map<OfferRecord>(([key, value]) => ({
        id: key,
        ...value
      }));

      let normalizedOffers: OfferRecord[];

      if (preferredCurrencyCode) {
        normalizedOffers = getOffersWithPreferredCurrency(
          normalizedData,
          preferredCurrencyCode
        );
      } else {
        normalizedOffers = normalizedData;
      }

      return normalizedOffers;
    },
    [preferredCurrencyCode, getOffersWithPreferredCurrency]
  );

  // normalize accommodations hook
  const normalizeAccommodations = useCallback(
    (
      accommodations: Record<string, WinAccommodation> | undefined,
      offers: Record<string, Offer> | undefined
    ): AccommodationWithId[] => {
      if (!accommodations) return [];
      const normalizedOffers = offers ? normalizeOffers(offers) : [];

      const normalizedAccommodations = Object.entries(
        accommodations
      ).map<AccommodationWithId>(([keyA, valueA]) => {
        const filteredOffers = normalizedOffers.filter((offer) =>
          Object.entries(offer.pricePlansReferences)
            .map(([, valueP]) => valueP.accommodation === keyA)
            .includes(true)
        );

        return {
          ...valueA,
          id: keyA,
          offers: filteredOffers
        };
      });

      return normalizedAccommodations;
    },
    [normalizeOffers]
  );

  return {
    getOffersWithPreferredCurrency,
    normalizeOffers,
    normalizeAccommodations
  };
};
