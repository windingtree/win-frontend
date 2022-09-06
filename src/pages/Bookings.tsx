import { useAppState } from '../store';
import { Grid, Box, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { isContract } from '@windingtree/win-commons/dist/multisig';
import { MessageBox } from '../components/MessageBox';
import { SignInButton } from '../components/Web3Modal';
import MainLayout from '../layouts/main';
import { useBookingsAuth } from '../hooks/useBookingsAuth';
import { useBookings } from '../hooks/useBookings';
import Iconify from '../components/Iconify';

export const Bookings = () => {
  const theme = useTheme();
  const { account, provider, walletAuth } = useAppState();
  const { login, logout } = useBookingsAuth();
  const bookings = useBookings();
  const [isLogin, setLogin] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [isAccountContract, setIsContract] = useState<boolean>(false);
  const isLoggedIn = useMemo(() => !!walletAuth, [walletAuth]);

  useEffect(() => {
    const checkIsContract = async () => {
      try {
        if (account && provider) {
          setIsContract(await isContract(account, provider));
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
  }, [account, provider]);

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
      <MessageBox type="warn" show={!account}>
        <Grid container direction="row" alignItems="center">
          <Grid item marginRight={theme.spacing(5)}>
            Please connect your wallet
          </Grid>
          <Grid item>
            <SignInButton />
          </Grid>
        </Grid>
      </MessageBox>

      <MessageBox type="warn" show={!!account && !isLoggedIn}>
        <Grid container direction="row" alignItems="center">
          <Grid item marginRight={theme.spacing(5)}>
            Please authorize your account. You will be prompted for signature.
          </Grid>
          <Grid item>
            <LoadingButton
              loading={isLogin}
              endIcon={<Iconify icon="ri:login-box-line" />}
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

      <MessageBox type="warn" show={isAccountContract}>
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
              justifyContent: 'space-between'
            }}
          >
            <Box padding={theme.spacing(2)}>N</Box>
            <Box padding={theme.spacing(2)}>offerId</Box>
            <Box padding={theme.spacing(2)}>orderId</Box>
          </Box>
          {bookings.map((booking, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box padding={theme.spacing(2)}>{index}</Box>
              <Box padding={theme.spacing(2)}>{booking.offerId}</Box>
              <Box padding={theme.spacing(2)}>{booking.orderId}</Box>
            </Box>
          ))}
        </>
      )}
    </MainLayout>
  );
};
