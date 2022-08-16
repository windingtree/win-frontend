import { Grommet } from 'grommet';
import { setConfiguration } from 'react-grid-system';

const breakpoints = {
  xsmall: 0,
  small: 600,
  medium: 900,
  large: 1200,
  xlarge: 1536
};

enum Breakpoint {
  xsmall = 'xsmall',
  small = 'small',
  medium = 'medium',
  large = 'large',
  xlarge = 'xlarge'
}

type BreakpointMediaQuery = {
  [breakpoint in keyof typeof Breakpoint]?: string;
};

// This returns the breakpoints in such a way so you can access the breakoints like this in styled-components:
//   ${({ theme }) => theme.breakpoints.large} {}
const getBreakpointsInCss = () => {
  const reducer = (previousValues: BreakpointMediaQuery, currentValue: Breakpoint) => {
    return {
      ...previousValues,
      [currentValue]: `@media (min-width: ${breakpoints[currentValue]}px)`
    };
  };

  return Object.keys(breakpoints).reduce(reducer, {});
};

export default breakpoints;

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
    }
    // TODO: Include the breakoints according the strucure of grommet.
  }
};

export const GrommetProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => (
  <Grommet theme={theme} full>
    {children}
  </Grommet>
);
