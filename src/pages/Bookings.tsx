import { useAppState } from '../store';
import { Grid, Box, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { isContract } from '@windingtree/win-commons/dist/multisig';
import { MessageBox } from '../components/MessageBox';
import MainLayout from '../layouts/main';
import { useBookingsAuth } from '../hooks/useBookingsAuth';
import { useBookings } from '../hooks/useBookings';
import { providers } from 'ethers';
import { useAccount, useProvider } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Iconify from '../components/Iconify';
import { DateTime } from 'luxon';

export const Bookings = () => {
  const theme = useTheme();
  const { address } = useAccount();
  const provider = useProvider();
  const { walletAuth } = useAppState();
  const { login, logout } = useBookingsAuth();
  const bookings = useBookings();
  const [isLogin, setLogin] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [isAccountContract, setIsContract] = useState<boolean>(false);
  const isLoggedIn = useMemo(() => !!walletAuth, [walletAuth]);

  useEffect(() => {
    const checkIsContract = async () => {
      try {
        if (provider && address) {
          setIsContract(await isContract(address, provider as providers.JsonRpcProvider));
        } else {
          setIsContract(false);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        setIsContract(false);
      }
    };

    checkIsContract();
  }, [provider, address]);

  const auth = useCallback(async () => {
    try {
      setError(undefined);
      setLogin(true);
      await login();
      setLogin(false);
    } catch (err) {
      setError(err.message || 'Unknown authorization error');
      setLogin(false);
    }
  }, [login]);

  return (
    <MainLayout>
      <MessageBox type="warning" show={typeof address !== 'string'}>
        <Grid container direction="row" alignItems="center">
          <Grid item marginRight={theme.spacing(5)}>
            Please connect your wallet
          </Grid>
          <Grid item>
            <ConnectButton/>
          </Grid>
        </Grid>
      </MessageBox>

      <MessageBox type="warning" show={!!address && !isLoggedIn}>
        <Grid container direction="row" alignItems="center">
          <Grid item marginRight={theme.spacing(5)}>
            Please authorize your account. You will be prompted for signature.
          </Grid>
          <Grid item>
            <LoadingButton
              loading={isLogin}
              endIcon={<Iconify icon="ri:login-box-line"/>}
              loadingPosition="end"
              variant="contained"
              disabled={isAccountContract}
              onClick={auth}
            >
              Authorize
            </LoadingButton>
          </Grid>
        </Grid>
      </MessageBox>

      <MessageBox type="warning" show={isAccountContract}>
        It seems that your connected account is a multisig wallet or other smart contract.
        It is not possible to authorize a smart contract address.
      </MessageBox>

      <MessageBox type="error" show={!!error}>
        <Box>{error}</Box>
      </MessageBox>

      {isLoggedIn && (
        <Box margin={theme.spacing(5)}>
          <Button variant="contained" onClick={logout}>
            LogOut
          </Button>
        </Box>
      )}

      {bookings.length > 0 && (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid silver'
            }}
          >
            <Box width="4%" padding={theme.spacing(1)}>N</Box>
            <Box width="20%" padding={theme.spacing(2)}>offerId</Box>
            <Box width="20%" padding={theme.spacing(2)}>orderId</Box>
            <Box width="10%" padding={theme.spacing(2)}>status</Box>
            <Box width="30%" padding={theme.spacing(2)}>message</Box>
            <Box width="16%" padding={theme.spacing(2)}>createdAt</Box>
          </Box>
          {bookings.map((booking, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid silver'
              }}
            >
              <Box width="4%" padding={theme.spacing(1)}>{index + 1}</Box>
              <Box width="20%" padding={theme.spacing(2)}>{booking.offerId}</Box>
              <Box width="20%" padding={theme.spacing(2)}>{booking.orderId || 'n/a'}</Box>
              <Box width="10%" padding={theme.spacing(2)}>{booking.status}</Box>
              <Box width="30%" padding={theme.spacing(2)}>{booking.message}</Box>
              <Box width="16%" padding={theme.spacing(2)}>{DateTime.fromISO(booking.createdAt).toLocaleString({
                weekday: 'short',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}</Box>
            </Box>
          ))}
        </>
      )}
    </MainLayout>
  );
};
