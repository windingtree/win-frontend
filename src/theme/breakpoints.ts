const breakpoints = {
  xsmall: 0,
  small: 600,
  medium: 900,
  large: 1200,
  xlarge: 1536
};

// This returns the breakpoints in such a way so you can access the breakoints like this in css:
//   ${({ theme }) => theme.breakpoints.large} {}
export const getBreakpointsInCss = () => {
  const reducer = (previousValues, currentValue) => {
    return {
      ...previousValues,
      [currentValue]: `@media (min-width: ${breakpoints[currentValue]}px)`
    };
  };

  return Object.keys(breakpoints).reduce(reducer, {});
};

export default breakpoints;
