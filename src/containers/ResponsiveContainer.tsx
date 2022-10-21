import type { ReactNode } from 'react';
import { Dialog, Stack } from '@mui/material';

export interface ResponsiveContainerProps {
  open: boolean;
  isCloseable: boolean;
  handleClose: () => void;
  children: ReactNode;
}

export const ResponsiveContainer = ({
  children,
  open,
  isCloseable,
  handleClose
}: ResponsiveContainerProps) => {
  return (
    <div>
      {isCloseable ? (
        <Dialog open={open} onClose={handleClose}>
          {children}
        </Dialog>
      ) : (
        <Stack>{children}</Stack>
      )}
    </div>
  );
};
