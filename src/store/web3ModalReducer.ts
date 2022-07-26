import type { Action } from './actions';
import type { State } from './types';

export const web3ModalReducer = (state: State, action: Action): State => {
  const type = action.type;

  try {
    switch (type) {
      case 'SET_PROVIDER':
        return {
          ...state,
          provider: action.payload
        };
      case 'SET_WEB3MODAL_SIGN_IN':
        return {
          ...state,
          signIn: action.payload
        };
      case 'SET_WEB3MODAL_SIGN_OUT':
        return {
          ...state,
          signOut: action.payload
        };
      default:
        return state;
    }
  } catch(error) {
    return state;
  }
};
