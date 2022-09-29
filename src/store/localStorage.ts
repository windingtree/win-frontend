import type { Action } from './actions';
import type { State } from './types';
import { safeObjectStringify } from '../utils/objects';

export const UNKNOWN_LOCAL_STORAGE_ERROR = 'Unknown localStorage error';
export const storagePropertyName = 'dappStore';

export interface LocalStorageConnectorConfig {
  properties: string[];
}

export const storageConnectorConfig: LocalStorageConnectorConfig = {
  properties: ['selectedNetwork', 'selectedAsset', 'searchParams', 'walletAuth']
};

export const sessionConnectorConfig: LocalStorageConnectorConfig = {
  properties: []
};

export type StoredStateProps = typeof storageConnectorConfig.properties[number];

export type StoredState = Pick<State, StoredStateProps>;

export type TransformCallback = <T>(serializedState: string) => T;

// Transformation function template
export const defaultTransform = (serializedState: string) => serializedState;

// Extracts selected properties into a new object
export const selectedState = (
  state: State,
  config: LocalStorageConnectorConfig
): StoredState =>
  config.properties.reduce<StoredState>(
    (a, v) => ({
      ...a,
      [v]: state[v]
    }),
    {}
  );

// Return stored state from specific storage
export const getStorageState = (
  storage: Storage,
  transform?: TransformCallback
): StoredState => {
  try {
    let serializedState = storage.getItem(storagePropertyName);

    if (serializedState === null) {
      // storage not initialized yet
      const emptyStorage = safeObjectStringify({});
      storage.setItem(storagePropertyName, emptyStorage);
      serializedState = emptyStorage;
    }

    serializedState = transform ? transform<string>(serializedState) : serializedState;

    return JSON.parse(serializedState);
  } catch (error) {
    throw new Error(
      `Unable to get stored state due to error: ${
        (error as Error).message || UNKNOWN_LOCAL_STORAGE_ERROR
      }`
    );
  }
};

// Return common state
// `transform` callback can be used for decryption
export const getState = (transform?: TransformCallback): StoredState => {
  const localState = getStorageState(localStorage, transform);
  const sessionState = getStorageState(sessionStorage, transform);
  return {
    ...localState,
    ...sessionState
  };
};

// Saves state to localStorage
export const setState = (
  state: StoredState,
  storage: Storage,
  transform?: TransformCallback
): void => {
  try {
    const serializedState = safeObjectStringify(state);
    storage.setItem(
      storagePropertyName,
      transform ? transform<string>(serializedState) : serializedState
    );
  } catch (error) {
    throw new Error(
      `Unable to store state due to error: ${
        (error as Error).message || UNKNOWN_LOCAL_STORAGE_ERROR
      }`
    );
  }
};

// Returns combined reducer
// `transform` callback can be used for encryption
export const storageReducer =
  (transform?: TransformCallback) =>
  (state: State, _: Action): State => {
    // Update the localStorage
    setState(selectedState(state, storageConnectorConfig), localStorage, transform);

    // Updated the sessionStorage
    setState(selectedState(state, sessionConnectorConfig), sessionStorage, transform);
    return state;
  };
