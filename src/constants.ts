const createSymbol = (name: string) => `substrate-lib/${name}`;

/**
 * STATUS
 */
export const INIT = createSymbol('INIT');

export const LOADING = createSymbol('LOADING');

export const ERROR = createSymbol('ERROR');

export const READY = createSymbol('READY');

/**
 * ACTIONS CONECTION API
 */
export const SWITCH_ENDPOINT = createSymbol('SWITCH_ENDPOINT');

export const CONNECT = createSymbol('CONNECT');

export const CONNECT_SUCCESS = createSymbol('CONNECT_SUCCESS');

export const CONNECT_ERROR = createSymbol('CONNECT_ERROR');

/**
 * KEYRING
 */
export const INIT_KEYRING = createSymbol('INIT_KEYRING');

export const LOAD_KEYRING = createSymbol('LOAD_KEYRING');

export const SET_KEYRING = createSymbol('SET_KEYRING');

export const KEYRING_ERROR = createSymbol('KEYRING_ERROR');
