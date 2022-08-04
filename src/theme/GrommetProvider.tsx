import { Grommet } from 'grommet';
import breakpoints from './breakpoints';
import { setConfiguration } from 'react-grid-system';

setConfiguration({ breakpoints: Object.values(breakpoints) });

const theme = {
  global: {
    colors: {
      brand: '#61dfaf'
    },
    font: {
      family: 'Inter',
      size: '1rem',
      height: '1.1rem'
    }
  }
};

export const GrommetProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => (
  <Grommet theme={theme} full>
    {children}
  </Grommet>
);
