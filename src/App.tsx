import { AppStateProvider } from './store';
import { AppRoutes } from './Routes';
import { Theme } from './Theme';

const App = () => (
  <AppStateProvider>
    <Theme>
      <AppRoutes />
    </Theme>
  </AppStateProvider>
);

export default App;
