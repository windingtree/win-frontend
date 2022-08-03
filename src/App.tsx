import { AppStateProvider } from './store';
import { AppRoutes } from './Routes';
import { ThemeProvider } from './theme/ThemeProvider';

const App = () => (
  <AppStateProvider>
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  </AppStateProvider>
);

export default App;
