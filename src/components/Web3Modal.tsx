import { LoadingButton } from '@mui/lab';
import { ButtonProps } from '@mui/material';
import Iconify from '../components/Iconify';
import { useAccount, useDisconnect } from '@web3modal/react';

export const SignOutButton = (props: ButtonProps) => {
  const disconnect = useDisconnect();
  const { account } = useAccount();

  if (!account.isConnected) {
    return null;
  }

  return (
    <LoadingButton
      variant="contained"
      onClick={() => disconnect()}
      startIcon={<Iconify icon="ri:logout-box-line" />}
      loading={account.isConnecting}
      {...props}
    >
      Disconnect
    </LoadingButton>
  );
};
