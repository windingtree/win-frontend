import { useAppDispatch, useAppState } from '../store';
import { PriceRange } from './useAccommodationsAndOffers';

export const usePriceFilter = () => {
  const { priceFilter } = useAppState();
  const dispatch = useAppDispatch();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setPriceFilter = (filter: PriceRange[]) => {
    dispatch({
      type: 'SET_PRICE_FILTER',
      payload: filter
    });
  };

  return { priceFilter, setPriceFilter };
};
