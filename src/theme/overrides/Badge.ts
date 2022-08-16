import { Theme } from '@mui/material/styles';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Badge(theme: Theme) {
  return {
    MuiBadge: {
      styleOverrides: {
        dot: {
          width: 10,
          height: 10,
          borderRadius: '50%'
        }
      }
    }
  };
}
