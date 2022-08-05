import { AppStateProvider } from './store';
import { AppRoutes } from './Routes';
import { GrommetProvider } from './theme/GrommetProvider';

const App = () => (
  <AppStateProvider>
    <GrommetProvider>
      <AppRoutes />
    </GrommetProvider>
  </AppStateProvider>
);

export default App;
