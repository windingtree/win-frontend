import { Alert, AlertColor, Box, CircularProgress, IconButton } from '@mui/material';
import Iconify from './Iconify';
export const allowedMessageBoxTypes = ['info', 'warn', 'error'];

export type MessageBoxTypes = typeof allowedMessageBoxTypes[number];

export interface MessageBoxProps {
  type: AlertColor;
  show: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  onClose?: () => void;
}

export const MessageBox = ({
  type = 'info',
  show = false,
  loading = false,
  children,
  onClose
}: MessageBoxProps) => {
  if (!show) {
    return null;
  }

  return (
    <Alert
      severity={type}
      sx={{ mb: 2, alignItems: 'center', textAlign: { xs: 'center', md: 'left' } }}
    >
      <Box>{children}</Box>
      {loading === true && <CircularProgress />}
      {typeof onClose === 'function' && (
        <Box justifySelf="end">
          <IconButton onClick={onClose}>
            <Iconify icon="ci:close-big" />
          </IconButton>
        </Box>
      )}
    </Alert>
  );
};
