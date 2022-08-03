import { Grommet } from 'grommet';
import breakpoints from './breakpoints';

const theme = {
  global: {
    colors: {
      brand: '#61dfaf'
    },
    font: {
      family: 'Inter',
      size: '1rem',
      height: '1.1rem'
    },
    breakpoints
  }
};

export const ThemeProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => (
  <Grommet theme={theme} full>
    {children}
  </Grommet>
);
