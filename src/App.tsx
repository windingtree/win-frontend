import { AppStateProvider } from './store';
import { web3ModalConfig } from './config';
import { AppRoutes } from './Routes';
import { GrommetProvider } from './theme/GrommetProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ThemeProvider from './theme/index';
import NotistackProvider from './components/NotistackProvider';
import { GlobalErrorBoundary } from './components/ErrorBoundary';
import { Web3Modal } from '@web3modal/react';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    },
    mutations: {
      retry: 2
    }
  }
});

const App = () => (
  <GlobalErrorBoundary>
    <ThemeProvider>
      <NotistackProvider>
        <QueryClientProvider client={queryClient}>
          <AppStateProvider>
            <GrommetProvider>
              <AppRoutes />
              <Web3Modal config={web3ModalConfig} />
            </GrommetProvider>
          </AppStateProvider>
        </QueryClientProvider>
      </NotistackProvider>
    </ThemeProvider>
  </GlobalErrorBoundary>
);

export default App;
