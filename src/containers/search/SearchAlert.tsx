import { Alert, AlertColor } from '@mui/material';
import { ReactNode } from 'react';

type SearchAlertProps = {
  children: ReactNode;
  severity?: AlertColor;
};

export const SearchAlert = ({ children, severity = 'error' }: SearchAlertProps) => {
  return (
    <Alert
      severity={severity}
      sx={{
        mt: 0.5,
        width: { xs: '100%', md: '70%', lg: '100' },
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center'
      }}
    >
      {children}
    </Alert>
  );
};
