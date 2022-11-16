import Blockies from 'react-blockies';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Paper, Typography } from '@mui/material';
import { useMemo } from 'react';
import { centerEllipsis } from '../utils/strings';
import Iconify from '../components/Iconify';

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
