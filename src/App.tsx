import { AppStateProvider } from './store';
import { AppRoutes } from './Routes';
import { GrommetProvider } from './theme/GrommetProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppStateProvider>
      <GrommetProvider>
        <AppRoutes />
      </GrommetProvider>
    </AppStateProvider>
  </QueryClientProvider>
);

export default App;
