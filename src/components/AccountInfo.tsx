import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Popover,
  Typography,
  Button,
  IconButton
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { copyToClipboard } from '../utils/strings';
import Iconify from '../components/Iconify';
import { useAccount, useNetwork, useDisconnect } from 'wagmi';
import { getNetworkInfo } from '../config';
import { Account } from './Account';

export const AccountInfo = () => {
  const theme = useTheme();
  const boxRef = useRef<HTMLDivElement>(document.createElement('div'));
  const { address, connector, isConnected } = useAccount();
  const network = useNetwork();
  const { disconnect, isLoading } = useDisconnect();
  const [open, setOpen] = useState<boolean>(false);
  const [explorer, setExplorer] = useState<string | undefined>();
  const connectedWith = useMemo(() => (connector ? connector.name : ''), [connector]);

  useEffect(() => {
    const getExplorer = async () => {
      try {
        if (!network || !network.chain) {
          setExplorer(undefined);
          return;
        }
        const { blockExplorer } = getNetworkInfo(network.chain.id);
        setExplorer(blockExplorer);
      } catch (err) {
        setExplorer(undefined);
      }
    };
    getExplorer();
  }, [network]);

  const handleOpen = useCallback(() => {
    setOpen(true);
    if (address) {
      copyToClipboard(address);
    }
  }, [address]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDisconnect = () => {
    setOpen(false);
    disconnect();
  };

  const handleOpenExplorer = (type: 'address' | 'tx', value: string) => {
    if (!explorer) {
      return;
    }
    window.open(`${explorer}/${type}/${value}`, '_blank');
  };

  if (!address || !isConnected) {
    return null;
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
        <Account account={address as string} open={open} />
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
                <Typography>Connected with {connectedWith}</Typography>
              </Box>
              <Box>
                <LoadingButton
                  variant="contained"
                  onClick={handleDisconnect}
                  startIcon={<Iconify icon="ri:logout-box-line" />}
                  loading={isLoading}
                >
                  Disconnect
                </LoadingButton>
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
                  <Account account={address as string} />
                </Box>
                <Box>
                  <Button
                    endIcon={<Iconify icon="ci:copy" />}
                    onClick={() => copyToClipboard(address)}
                  >
                    Copy address
                  </Button>
                </Box>
              </Box>
              <Box>
                <Button
                  variant="outlined"
                  disabled={explorer === undefined}
                  onClick={() => handleOpenExplorer('address', address)}
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
