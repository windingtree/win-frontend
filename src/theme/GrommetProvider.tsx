import { Grommet } from 'grommet';
import breakpoints, { getBreakpointsInCss } from './breakpoints';
import { setConfiguration } from 'react-grid-system';

setConfiguration({
  breakpoints: Object.values(breakpoints),
  //The container widht is not decided by the grid component, but by the paylaout in which it is in.
  containerWidths: [9999, 9999, 9999, 9999, 9999, 9999]
});

const theme = {
  breakpoints: getBreakpointsInCss(),
  global: {
    colors: {
      brand: '#61dfaf'
    },
    font: {
      family: 'Inter',
      size: '1rem',
      height: '1.1rem'
    },
    breakpoints: {
      xsmall: {
        value: breakpoints.xsmall
      },
      small: {
        value: breakpoints.small
      },
      medium: {
        value: breakpoints.medium
      },
      large: {
        value: breakpoints.large
      },
      xlarge: {
        value: breakpoints.xlarge
      }
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
