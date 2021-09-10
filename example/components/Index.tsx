import * as React from 'react';
import {
  useSnackbar,
  // SnackbarMessage,
  // OptionsObject,
  // SnackbarKey,
} from 'notistack';
import {
  INIT,
  LOADING,
  READY,
  useSubstrate,
  switchEndpoint,
  initKeyring,
} from '../../src/.';
import SimpleBackdrop from './SimpleBackdrop';
import ProgressBar from './ProgressBar';

const anchorOrigin = {
  vertical: 'top',
  horizontal: 'right',
};

const Index = () => {  
  const { state: { apiState, keyringState, endpoint } } = useSubstrate();

  const loading = apiState === INIT || apiState === LOADING || keyringState === LOADING;

  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    if(apiState === INIT) {
      enqueueSnackbar(`Connecting to ${endpoint} ...`, {
        anchorOrigin,
      });
    }
  
    if(apiState === READY) {
      enqueueSnackbar(`Connected to ${endpoint} successful!`, {
        variant: 'success',
        anchorOrigin,
      });
    }
  }, [apiState]);

  React.useEffect(() => {
    if(keyringState === INIT) {
      enqueueSnackbar(`Loading accounts ...`, {
        anchorOrigin,
      });
    }
  
    if(keyringState === READY) {
      enqueueSnackbar(`Loaded accounts successful!`, {
        variant: 'success',
        anchorOrigin,
      });
    }
  }, [keyringState]);

  return (<>
    <SimpleBackdrop open={loading} />
    {loading && <ProgressBar />}
  </>);
};

export default Index;
