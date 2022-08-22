import Blockies from 'react-blockies';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Popover, Typography } from '@mui/material';
import { useState, useMemo, useCallback, useRef } from 'react';
import { centerEllipsis, copyToClipboard } from '../utils/strings';
import { useAppState } from 'src/store';

const AccountIcon = styled(Blockies)`
  border-radius: 50%;
`;

export const AccountInfo = () => {
  const theme = useTheme();
  const boxRef = useRef();
  const { account } = useAppState();
  const [open, setOpen] = useState<boolean>(false);
  const shortAccount = useMemo(() => centerEllipsis(account || ''), [account]);

  const handleOpen = useCallback(() => {
    setOpen(true);
    if (account) {
      copyToClipboard(account);
    }
  }, [account]);

  const handleClose = () => {
    setOpen(false);
  };

  if (!account) {
    return null;
  }

  return (
    <Box
      ref={boxRef}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
      marginRight={theme.spacing(5)}
      onClick={handleOpen}
    >
      <Box marginRight="5px">
        <AccountIcon seed={account} size={7} scale={4} />
      </Box>
      <Box>
        <Typography color="primary" variant="body2">
          {shortAccount}
        </Typography>
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
        <Typography color="primary" variant="body1">
          {account}
        </Typography>
        <Typography color="primary" variant="body2">
          This component not finished yet.
        </Typography>
      </Popover>
    </Box>
  );
};
