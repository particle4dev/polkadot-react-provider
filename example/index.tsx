import 'react-app-polyfill/ie11';
import 'regenerator-runtime/runtime';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import { createTheme } from '@material-ui/core/styles';
import NextHead from 'next/head';
import { SnackbarProvider } from 'notistack';
import RobotoHead from './components/RobotoHead';
import GlobalStyle from './components/GlobalStyle';
import Global from './components/Global';
import Index from './components/Index';
import { SubstrateProvider } from '../src';

const theme = createTheme({
  palette: {
    type: 'dark'
  }
});

const App = () => {
  const endpoint = process.env!.NEXT_PUBLIC_ENDPOINT || 'wss://rpc.polkadot.io';

  return (<>
    <NextHead>
      <meta charSet="utf-8" />
    </NextHead>
    
    <SnackbarProvider maxSnack={3}>
      <SubstrateProvider endpoint={endpoint}>
        <ThemeProvider theme={theme}>
          <Index />
          <GlobalStyle />
          <Global />
        </ThemeProvider>
      </SubstrateProvider>
    </SnackbarProvider>
    <RobotoHead />
  </>);
};

ReactDOM.render(<App />, document.getElementById('root'));
