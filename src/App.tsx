import { AppStateProvider } from './store';
import { AppRoutes } from './Routes';
import { GrommetProvider } from './theme/GrommetProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ThemeProvider from './theme/index';

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <AppStateProvider>
        <GrommetProvider>
          <AppRoutes />
        </GrommetProvider>
      </AppStateProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
