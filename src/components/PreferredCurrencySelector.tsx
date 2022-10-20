import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  styled,
  Typography
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useCurrencies } from '../hooks/useCurrencies';
import { useAppDispatch, useAppState } from '../store';
import { emptyFunction } from '../utils/common';
import { CurrencyCode } from '../utils/currencies';
import Iconify from './Iconify';

interface StyledStackProps {
  selected: boolean;
}

const StyledStack = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'selected'
})<StyledStackProps>(({ theme, selected }) => ({
  padding: `${theme.spacing(1)} ${theme.spacing(2.5)}`,
  border: selected ? `1px solid ${theme.palette.grey[700]}` : '1px solid transparent',
  cursor: 'pointer',
  '&:hover': {
    border: `1px solid ${theme.palette.grey[300]}`
  }
}));

const CurrencyItem = ({ code, name, selected = false, onClick = emptyFunction }) => {
  return (
    <StyledStack selected={selected} onClick={onClick}>
      <Typography>{name}</Typography>
      <Typography>{code}</Typography>
    </StyledStack>
  );
};

export const PreferredCurrencySelector = () => {
  const { account, userSettings } = useAppState();
  const dispatch = useAppDispatch();
  const { displayCurrencies } = useCurrencies();
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  const handleCurrencyChange = useCallback(
    (code: string) => {
      dispatch({
        type: 'SET_PREFERRED_CURRENCY',
        payload: code as CurrencyCode
      });
      closeDialog();
    },
    [closeDialog, dispatch]
  );

  const { preferredCurrencyCode } = userSettings;

  // hide currency selector when wallet is connected
  if (account) {
    return null;
  }

  return (
    <>
      <Box>
        <Button onClick={openDialog} sx={{ fontWeight: 'regular' }}>
          {preferredCurrencyCode}
        </Button>
      </Box>
      <Dialog
        open={dialogOpen}
        maxWidth={'md'}
        PaperProps={{ sx: { p: 2 } }}
        onClose={closeDialog}
      >
        <DialogTitle mb={3}>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Typography variant="h4">Choose a currency</Typography>
            <IconButton onClick={closeDialog}>
              <Iconify icon="ci:close-big" />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={{ xs: 1, md: 2 }}>
            {Object.entries(displayCurrencies).map(([code, { name }]) => {
              return (
                <Grid item xs={6} sm={4} md={3} key={code}>
                  <CurrencyItem
                    name={name}
                    code={code}
                    onClick={() => handleCurrencyChange(code)}
                  />
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};
