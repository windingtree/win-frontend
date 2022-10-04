import type { Action } from './actions';
import type { State } from './types';
import Logger from '../utils/logger';

const logger = Logger('checkoutReducer');

export const checkOutReducer = (state: State, action: Action): State => {
  const type = action.type;

  try {
    switch (type) {
      case 'SET_ORGANIZER_INFO':
        return {
          ...state,
          organizerInfo: action.payload
        };
      case 'SET_BOOKING_INFO':
        return {
          ...state,
          bookingInfo: action.payload
        };
      case 'SET_CHECKOUT':
        return {
          ...state,
          checkout: action.payload
        };
      case 'SET_GROUP_CHECKOUT':
        return {
          ...state,
          groupCheckout: action.payload
        };
      default:
        return state;
    }
  } catch (error) {
    logger.error(error);
    return state;
  }
};
