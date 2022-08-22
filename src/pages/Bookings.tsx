import { useAppState } from '../store';
import { Box } from '@mui/material';
import { useMemo, useState } from 'react';
import { MessageBox } from '../../src/components/MessageBox';
import MainLayout from '../../src/layouts/main';
import { useBookingsAuth } from '../hooks/useBookingsAuth';

export const Bookings = () => {
  const { walletAuth } = useAppState();
  const { login, logout } = useBookingsAuth();
  const [isLogin, setLogin] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const isLoggedIn = useMemo(
    () => !!walletAuth,
    [walletAuth]
  );

  return (
    <MainLayout>
      {!isLoggedIn &&
        <>
        </>
      }

      <MessageBox type="info" loading show={isLogin}>
        Authorization in process
      </MessageBox>
      <MessageBox type="error" show={!!error}>
        <Box>{error}</Box>
      </MessageBox>
    </MainLayout>
  );
};
