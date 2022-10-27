import type { UserSettingsAction } from './actions';
import type { State } from './types';
import Logger from '../utils/logger';
import { defaultCurrencyCode } from '../config';

const logger = Logger('userSettingsReducer');

export const userSettingsReducer = (state: State, action: UserSettingsAction): State => {
  const type = action.type;

  try {
    switch (type) {
      case 'SET_PREFERRED_CURRENCY':
        return {
          ...state,
          userSettings: {
            ...{ ...state.userSettings },
            // currency must always be set
            preferredCurrencyCode: action.payload ?? defaultCurrencyCode
          }
        };
      default:
        return state;
    }
  } catch (error) {
    logger.error(error);
    return state;
  }
};
