import { AppStateProvider } from './store';
import { AppRoutes } from './Routes';
import { GrommetProvider } from './theme/GrommetProvider';
import ThemeProvider from './theme/index';

const App = () => (
  <ThemeProvider>
    <AppStateProvider>
      <GrommetProvider>
        <AppRoutes />
      </GrommetProvider>
    </AppStateProvider>
  </ThemeProvider>
);

export default App;
