import type { Action } from './actions';
import type { State } from './types';
import Logger from '../utils/logger';

const logger = Logger('allowedCookiesReducer');

export const allowedCookiesReducer = (state: State, action: Action): State => {
  const type = action.type;

  try {
    switch (type) {
      case 'SET_ALLOWED_COOKIES':
        return {
          ...state,
          allowedCookies: action.payload
        };
      default:
        return state;
    }
  } catch (error) {
    logger.error(error);
    return state;
  }
};
