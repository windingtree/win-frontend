import { Theme } from '@mui/material/styles';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Link(theme: Theme) {
  return {
    MuiLink: {
      defaultProps: {
        underline: 'hover'
      }
    }
  };
}
