import { useContext } from 'react';
import { Box, Button, Spinner, ResponsiveContext } from 'grommet';
import { StatusInfo, Alert } from 'grommet-icons';

export const allowedMessageBoxTypes = ['info', 'warn', 'error'];

export type MessageBoxTypes = typeof allowedMessageBoxTypes[number];

export interface MessageBoxProps {
  type: MessageBoxTypes;
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
  const size = useContext(ResponsiveContext);

  if (!show) {
    return null;
  }

  return (
    <Box
      fill
      direction="row"
      background="light-2"
      align="center"
      gap={size}
      pad={size}
      margin={{ bottom: 'small' }}
    >
      <Box>
        {type === 'info' && <StatusInfo color="status-ok" size={size} />}
        {type === 'warn' && <Alert color="status-warning" size={size} />}
        {type === 'error' && <Alert color="status-error" size={size} />}
      </Box>
      <Box direction="column" gap={size}>
        <Box>{children}</Box>
        {typeof onClose === 'function' && (
          <Box>
            <Button primary onClick={onClose} label="close" />
          </Box>
        )}
      </Box>
      {loading === true && (
        <Box>
          <Spinner />
        </Box>
      )}
    </Box>
  );
};
