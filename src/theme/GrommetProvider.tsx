import { Grommet } from 'grommet';
import breakpoints from './breakpoints';
import { setConfiguration } from 'react-grid-system';

setConfiguration({
  breakpoints: Object.values(breakpoints),
  //The container widht is not decided by the grid component, but by the paylaout in which it is in.
  containerWidths: [9999, 9999, 9999, 9999, 9999, 9999]
});

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
