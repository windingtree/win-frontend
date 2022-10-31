import { useAppDispatch, useAppState } from '../store';
import { PriceRange } from './useAccommodationsAndOffers';

export const usePriceFilter = () => {
  const { priceFilter } = useAppState();
  const dispatch = useAppDispatch();

  const setPriceFilter = (filter: PriceRange[]) => {
    dispatch({
      type: 'SET_PRICE_FILTER',
      payload: filter
    });
  };

  const clearPriceFilter = () => {
    dispatch({
      type: 'CLEAR_PRICE_FILTER'
    });
  };

  return { priceFilter, setPriceFilter, clearPriceFilter };
};
