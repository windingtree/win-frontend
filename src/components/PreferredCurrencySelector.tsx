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
import { useCallback, useEffect, useState } from 'react';
import { CurrencyCode, useCurrencies } from '../hooks/useCurrencies';
import { usePriceFilter } from '../hooks/usePriceFilter';
import { useUserSettings } from '../hooks/useUserSettings';
import { useAppState } from '../store';
import { emptyFunction } from '../utils/common';
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
  const { account } = useAppState();

  // get user settings
  const { preferredCurrencyCode, setUserSetting } = useUserSettings();
  const { clearPriceFilter } = usePriceFilter();

  useEffect(() => {
    // TO-DO: convert currency of price filter when preferred currency changes
    // for now just clear the priceFilter

    clearPriceFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferredCurrencyCode]);

  // get display currencies list
  const { currenciesAndRates = {} } = useCurrencies();
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => setDialogOpen(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const closeDialog = () => setDialogOpen(false);

  const handleCurrencyChange = useCallback(
    (code: string) => {
      setUserSetting('preferredCurrencyCode', code);
      closeDialog();
    },
    [closeDialog, setUserSetting]
  );

  // hide currency selector when wallet is connected
  if (account) {
    return null;
  }

  if (!currenciesAndRates || !Object.keys(currenciesAndRates).length) {
    return null;
  }

  return (
    <>
      <Box>
        <Button onClick={openDialog} sx={{ fontWeight: 'regular' }}>
          {preferredCurrencyCode as CurrencyCode}
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
            {[...Object.entries(currenciesAndRates)]
              .sort(([code1], [code2]) => code1.localeCompare(code2))
              .map(([code, { name }]) => {
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
