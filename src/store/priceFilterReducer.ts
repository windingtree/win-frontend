import type { PriceFilterAction } from './actions';
import type { State } from './types';
import Logger from '../utils/logger';

const logger = Logger('priceFilterReducer');

export const priceFilterReducer = (state: State, action: PriceFilterAction): State => {
  const type = action.type;

  try {
    switch (type) {
      case 'SET_PRICE_FILTER':
        return {
          ...state,
          priceFilter: [...action.payload]
        };
      case 'CLEAR_PRICE_FILTER':
        return {
          ...state,
          priceFilter: []
        };
      default:
        return state;
    }
  } catch (error) {
    logger.error(error);
    return state;
  }
};
