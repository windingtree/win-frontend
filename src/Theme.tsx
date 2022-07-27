import { Grommet } from 'grommet';

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

export const Theme: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => (
  <Grommet theme={theme} full>
    {children}
  </Grommet>
);
