import { createAction } from 'redux-actions';
import { ApiPromise } from '@polkadot/api';
import {
  SWITCH_ENDPOINT,
  CONNECT,
  CONNECT_SUCCESS,
  CONNECT_ERROR,

  INIT_KEYRING,
  LOAD_KEYRING,
  SET_KEYRING,
  KEYRING_ERROR,
} from './constants';

export const initKeyring = createAction(INIT_KEYRING);

export const loadKeyring = createAction(LOAD_KEYRING);

export const keyringError = createAction(KEYRING_ERROR);

export const setKeyring = createAction(SET_KEYRING, (keyring: any) => ({
  keyring,
}));

/**
 * ACTIONS CONECTION API
 */
export const switchEndpoint = createAction(
  SWITCH_ENDPOINT,
  (input: string) => ({
    input,
  })
);

export const connectNetwork = createAction(CONNECT, (api: ApiPromise) => ({
  api,
}));

export const connectSuccess = createAction(CONNECT_SUCCESS);

export const connectError = createAction(CONNECT_ERROR, (err: any) => ({
  err,
}));
