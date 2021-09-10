import * as React from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import keyring from '@polkadot/ui-keyring';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import type { KeyringPair } from '@polkadot/keyring/types';
import {
  connectNetwork,
  connectSuccess,
  connectError,
  setKeyring,
  keyringError,
  loadKeyring,
  switchEndpoint,
  initKeyring,
  loadAddresses
} from './actions';
import { INIT, READY } from './constants';
import SubstrateContext from './Context';
import reducer, { initialState, InitialStateType, Address } from './reducer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('substrate-lib:SubstrateProvider');

const connect = (
  state: InitialStateType,
  dispatch: React.Dispatch<any>,
  // enqueueSnackbar: (
  //   message: SnackbarMessage,
  //   options?: OptionsObject
  // ) => SnackbarKey
) => {
  // const { apiState, socket, jsonrpc, types } = state;
  const { apiState, api, endpoint } = state;
  // We only want this function to be performed once
  if (apiState === READY && api) {
    api.disconnect();
  }

  // const provider = new WsProvider(socket);
  // const _api = new ApiPromise({ provider, types, rpc: jsonrpc });
  const wsProvider = new WsProvider(endpoint as string);
  const _api = new ApiPromise({ provider: wsProvider });

  // Set listeners for disconnection and reconnection event.
  _api.on('connected', () => {
    dispatch(connectNetwork(_api));
    // `ready` event is not emitted upon reconnection and is checked explicitly here.
    _api.isReady.then(() => {
      dispatch(connectSuccess());
    });
  });

  _api.on('ready', async () => {
    dispatch(connectSuccess());
  });

  _api.on('error', (err: any) => {
    // console.log(apiState, 'apiState');
    // api.disconnect();
    dispatch(connectError(err));
  });
};

let loadAccts = false;

const loadAccounts = (
  state: InitialStateType,
  dispatch: React.Dispatch<any>,
) => {
  const asyncLoadAccounts = async () => {
    try {
      dispatch(loadKeyring());

      const { web3Accounts, web3Enable } = await import(
        '@polkadot/extension-dapp'
      );
      await web3Enable('proof-of-existence-ui');
      let allAccounts = await web3Accounts();

      allAccounts = allAccounts.map(
        ({ address, meta }: InjectedAccountWithMeta) => ({
          address,
          meta: {
            ...meta,
            name: `${meta.name} (${meta.source})`,
          },
        })
      );

      keyring.loadAll(
        {
          isDevelopment: process.env!.NODE_ENV === 'development',
        },
        allAccounts
      );

      dispatch(setKeyring(keyring));

      const keyringOptions: Address[] = await Promise.all(keyring.getPairs().map(async (account: KeyringPair) => {
        const { address, meta } = account;
        return ({
          key: address,
          address: address,
          name: meta.name,
          source: meta.source,
          isTesting: meta.isTesting,
          isInjected: meta.isInjected,
        } as Address);
      }));
  
      if(keyringOptions.length > 0) {
        dispatch(loadAddresses(keyringOptions));
      }
    } catch (e) {
      debug.error(e);
      dispatch(keyringError());
    }
  };

  const { keyringState } = state;
  // If `keyringState` is not null `asyncLoadAccounts` is running.
  if (keyringState === READY) return;
  // If `loadAccts` is true, the `asyncLoadAccounts` has been run once.
  if (loadAccts) return dispatch(setKeyring(keyring));

  // This is the heavy duty work
  loadAccts = true;
  asyncLoadAccounts();
};

export type SubstrateProviderProps = {
  children: React.ReactNode;
  endpoint: string;
};

const SubstrateProvider = ({ children, endpoint }: SubstrateProviderProps) => {
  debug('render');

  const [state, dispatch]: any = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    if (state.apiState === INIT) {
      connect(state, dispatch);
    }
  }, [state.apiState]);

  React.useEffect(() => {
    if (state.keyringState === INIT) {
      loadAccounts(state, dispatch);
    }
  }, [state.keyringState]);

  React.useEffect(() => {
    if(state.apiState === null) {
      dispatch(switchEndpoint(endpoint));
    }

    if(state.keyringState === null) {
      dispatch(initKeyring());
    }
  }, []);

  const contextValue: any = React.useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  console.log(state, 'state');

  return (
    <SubstrateContext.Provider value={contextValue}>
      {children}
    </SubstrateContext.Provider>
  );
};

if (process.env.NODE_ENV !== 'production') {
  SubstrateProvider.displayName = 'substrate_lib__SubstrateProvider';
}

SubstrateProvider.defaultProps = {};

export default SubstrateProvider;
