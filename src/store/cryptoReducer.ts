import type { Action } from './actions';
import type { State } from './types';
import Logger from '../utils/logger';

const logger = Logger('cryptoReducer');

export const cryptoReducer = (state: State, action: Action): State => {
  const type = action.type;

  try {
    switch (type) {
      case 'SET_SELECTED_NETWORK':
        return {
          ...state,
          selectedNetwork: action.payload
        };
      case 'SET_SELECTED_ASSET':
        return {
          ...state,
          selectedAsset: action.payload
        };
      default:
        return state;
    }
  } catch (error) {
    logger.error(error);
    return state;
  }
};
