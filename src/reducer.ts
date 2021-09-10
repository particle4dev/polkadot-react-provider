import { handleActions } from 'redux-actions';
import { ApiPromise } from '@polkadot/api';
import {
  INIT_KEYRING,
  LOAD_KEYRING,
  SET_KEYRING,
  KEYRING_ERROR,

  INIT,
  LOADING,
  ERROR,
  READY,

  CONNECT,
  CONNECT_SUCCESS,
  CONNECT_ERROR,
  SWITCH_ENDPOINT,
} from './constants';

export type InitialStateType = {
  keyring: any;
  keyringState: any;

  api: null | ApiPromise;
  apiError: any;
  apiState: null | string;
  endpoint: null | string;
};

// The initial state of the App
export const initialState: InitialStateType = {
  // socket: connectedSocket,
  // jsonrpc: { ...jsonrpc, ...config.RPC },
  // types: config.types,
  keyring: null,
  keyringState: null,

  api: null,
  apiError: null,
  apiState: null,
  endpoint: null,
};

export default handleActions(
  {
    /** connect to network */
    [SWITCH_ENDPOINT]: (state: InitialStateType, { payload }: any) => {
      const { input } = payload;
      return Object.assign({}, state, {
        apiState: INIT,
        endpoint: input,
      });
    },

    [CONNECT]: (
      state: InitialStateType,
      { payload }: { payload: { api: ApiPromise } }
    ) => {
      return { ...state, api: payload.api, apiState: LOADING };
    },

    [CONNECT_SUCCESS]: (state: InitialStateType) => {
      return { ...state, apiState: READY };
    },

    [CONNECT_ERROR]: (state: InitialStateType, { payload }: any) => {
      return { ...state, apiState: ERROR, apiError: payload.err };
    },

    /** keyring */
    [INIT_KEYRING]: (state: InitialStateType) => {
      return { ...state, keyringState: INIT };
    },

    [LOAD_KEYRING]: (state: InitialStateType) => {
      return { ...state, keyringState: LOADING };
    },

    [KEYRING_ERROR]: (state: InitialStateType) => {
      return { ...state, keyring: null, keyringState: ERROR };
    },

    [SET_KEYRING]: (state: InitialStateType, { payload }: any) => {
      return { ...state, keyring: payload.keyring, keyringState: READY };
    },
  },
  initialState
);
