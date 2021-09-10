import { handleActions } from 'redux-actions';
import { ApiPromise } from '@polkadot/api';
import { Keyring } from '@polkadot/ui-keyring';
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

  LOAD_ADDRESSES,
  SWITCH_ADDRESS,
} from './constants';

export type Address = {
  key: null | string;
  address: null | string;
  name: string;
  source: string;
  isTesting: boolean;
  isInjected: boolean;
}

export type InitialStateType = {
  keyring: Keyring;
  keyringState: null | string;

  api: null | ApiPromise;
  apiError: any;
  apiState: null | string;
  endpoint: null | string;

  addresses: Record<string, Address>;
  address: null | string;
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

  addresses: {},
  address: null,
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

    [LOAD_ADDRESSES]: (state: InitialStateType, { payload }: any) => {
      const addresses: Record<string, Address> = {};
      for(let i = 0; i < payload.addresses.length; i += 1) {
        const address = payload.addresses[i];
        addresses[address.key] = address;
      }
      let address = state.address;
      if(state.address === null) {
        const a = addresses[Object.keys(addresses)[0]];
        address = a.address;
      }
      return { ...state, addresses, address };
    },

    [SWITCH_ADDRESS]: (state: InitialStateType, { payload }: any) => {
      return { ...state, address: payload.address };
    },
  },
  initialState
);
