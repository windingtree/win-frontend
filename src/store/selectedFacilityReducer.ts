import type { Action } from './actions';
import type { State } from './types';
import Logger from '../utils/logger';

const logger = Logger('searchReducer');

export const selectedFacilityReducer = (state: State, action: Action): State => {
  const type = action.type;

  try {
    switch (type) {
      case 'SET_SELECTED_FACILITY_ID':
        return {
          ...state,
          selectedFacilityId: action.payload
        };
      case 'RESET_SELECTED_FACILITY_ID':
        return {
          ...state,
          selectedFacilityId: undefined
        };
      default:
        return state;
    }
  } catch (error) {
    logger.error(error);
    return state;
  }
};
