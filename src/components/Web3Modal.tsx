import { LoadingButton } from '@mui/lab';
import { ButtonProps } from '@mui/material';
import Iconify from '../components/Iconify';
import { useAppState } from '../store';

export const SignInButton = (props: ButtonProps) => {
  const { isConnecting, signIn, provider } = useAppState();

  if (!signIn || provider) {
    return null;
  }

  return (
    <LoadingButton
      variant="contained"
      onClick={() => signIn()}
      loading={isConnecting}
      startIcon={<Iconify icon="ri:login-box-line" />}
      {...props}
    >
      Connect Wallet
    </LoadingButton>
  );
};

export const SignOutButton = (props: ButtonProps) => {
  const { isConnecting, signOut, provider } = useAppState();

  if (!signOut || !provider) {
    return null;
  }

  return (
    <LoadingButton
      variant="contained"
      onClick={() => signOut()}
      startIcon={<Iconify icon="ri:logout-box-line" />}
      loading={isConnecting}
      {...props}
    >
      Disconnect
    </LoadingButton>
  );
};
