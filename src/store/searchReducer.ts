import type { Action } from './actions';
import type { State } from './types';
import Logger from '../utils/logger';

const logger = Logger('searchReducer');

export const searchReducer = (state: State, action: Action): State => {
  const type = action.type;

  try {
    switch (type) {
      case 'SET_SEARCH_PARAMS':
        return {
          ...state,
          searchParams: action.payload
        };
      default:
        return state;
    }
  } catch (error) {
    logger.error(error);
    return state;
  }
};
