import Blockies from 'react-blockies';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Paper,
  Popover,
  Typography,
  Button,
  IconButton
} from '@mui/material';
import { useState, useMemo, useCallback, useRef } from 'react';
import { centerEllipsis, copyToClipboard } from '../utils/strings';
import Iconify from '../components/Iconify';
import { SignOutButton } from './Web3Modal';
import { Web3Button, useAccount, useNetwork } from '@web3modal/react';

export interface AccountProps {
  account: string;
  open?: boolean;
}

const AccountIcon = styled(Blockies)`
  border-radius: 50%;
`;

export const Account = ({ account, open }: AccountProps) => {
  const theme = useTheme();
  const shortAccount = useMemo(() => centerEllipsis(account || ''), [account]);

  return (
    <Paper
      variant="outlined"
      sx={{
        display: 'flex',
        alignItems: 'center',
        marginRight: { md: theme.spacing(5) },
        padding: '3px 4px 2px 4px'
      }}
    >
      <Box marginRight="5px">
        <AccountIcon seed={account} size={7} scale={4} />
      </Box>
      <Box>
        <Typography color="primary" variant="body2">
          {shortAccount}
        </Typography>
      </Box>
      {open !== undefined && (
        <Iconify
          color="inherit"
          icon={`akar-icons:chevron-${open ? 'up' : 'down'}`}
          marginLeft={theme.spacing(1)}
        />
      )}
    </Paper>
  );
};

export const AccountInfo = () => {
  const theme = useTheme();
  const boxRef = useRef<HTMLDivElement>(null);
  const { account } = useAccount();
  const { network } = useNetwork();

  const [open, setOpen] = useState<boolean>(false);
  //@todo
  // const connectedWith = useMemo(
  //   () => (provider && provider.isMetaMask ? 'MetaMask' : 'WalletConnect'),
  //   [provider]
  // );

  const handleOpen = useCallback(() => {
    setOpen(true);
    if (account.isConnected) {
      copyToClipboard(account.address);
    }
  }, [account]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenExplorer = (type: 'address' | 'tx', value: string) => {
    if (!network || !network.chain) {
      return;
    }
    window.open(
      `${network.chain?.blockExplorers?.default.url}/${type}/${value}`,
      '_blank'
    );
  };

  if (!account.isConnected) {
    return <Web3Button />;
  }

  return (
    <>
      <Box
        ref={boxRef}
        onClick={handleOpen}
        sx={{
          cursor: 'pointer',
          borderRadius: '6px'
        }}
      >
        <Account account={account.address} open={open} />
      </Box>
      <Popover
        id="account_control"
        open={open}
        onClose={handleClose}
        anchorEl={boxRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <Card>
          <CardHeader
            title="Account"
            action={
              <IconButton onClick={handleClose}>
                <Iconify icon="ci:close-big" />
              </IconButton>
            }
          />
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              marginBottom={theme.spacing(2)}
            >
              <Box marginRight={theme.spacing(2)}>
                {/* <Typography>Connected with {connectedWith}</Typography> */}
              </Box>
              <Box>
                <SignOutButton />
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'top',
                justifyContent: 'space-between'
              }}
              marginBottom={theme.spacing(2)}
            >
              <Box marginRight={theme.spacing(2)}>
                <Box>
                  <Account account={account.address} />
                </Box>
                <Box>
                  <Button
                    endIcon={<Iconify icon="ci:copy" />}
                    onClick={() => copyToClipboard(account.address)}
                  >
                    Copy address
                  </Button>
                </Box>
              </Box>
              <Box>
                <Button
                  variant="outlined"
                  disabled={network === undefined || network.chain === undefined}
                  onClick={() => handleOpenExplorer('address', account.address)}
                >
                  Open in explorer
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Popover>
    </>
  );
};
