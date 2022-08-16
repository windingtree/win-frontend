import { Theme } from '@mui/material/styles';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SvgIcon(theme: Theme) {
  return {
    MuiSvgIcon: {
      styleOverrides: {
        fontSizeSmall: {
          width: 20,
          height: 20,
          fontSize: 'inherit'
        },
        fontSizeLarge: {
          width: 32,
          height: 32,
          fontSize: 'inherit'
        }
      }
    }
  };
}
