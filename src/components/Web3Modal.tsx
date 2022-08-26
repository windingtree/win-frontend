import { Box, Button, Typography, CircularProgress } from '@mui/material';
import Iconify from '../components/Iconify';
import useResponsive from '../hooks/useResponsive';
import { useAppState } from '../store';

export const SignInButton = () => {
  const isDesktop = useResponsive('up', 'md');
  const { isConnecting, signIn, provider } = useAppState();

  if (!signIn || provider) {
    return null;
  }

  return (
    <Button variant="contained" onClick={() => signIn()} disabled={isConnecting}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {isDesktop && (
          <Typography variant="body2">
            {isConnecting ? 'Connecting' : 'Connect'}
          </Typography>
        )}
        {!isDesktop && <Iconify icon="ri:login-box-line" />}
        {isConnecting && <CircularProgress size={18} color="inherit" />}
      </Box>
    </Button>
  );
};

export const SignOutButton = () => {
  const isDesktop = useResponsive('up', 'md');
  const { isConnecting, signOut, provider } = useAppState();

  if (!signOut || !provider) {
    return null;
  }

  return (
    <Button variant="contained" onClick={() => signOut()} disabled={isConnecting}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {isDesktop && (
          <Typography variant="body2">
            {isConnecting ? 'Connecting' : 'Disconnect'}
          </Typography>
        )}
        {!isDesktop && <Iconify icon="ri:logout-box-line" />}
        &nbsp;{isConnecting && <CircularProgress size={18} color="inherit" />}
      </Box>
    </Button>
  );
};
