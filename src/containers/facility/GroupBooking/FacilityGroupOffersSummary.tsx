import { Box, Button, Typography, Stack, Tooltip, Grid, useTheme } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { IconButtonAnimate } from 'src/components/animate';
import Iconify from 'src/components/Iconify';
import { OfferRecord } from 'src/store/types';

const getTotalPrice = (prev: number, current: OfferRecord): number => {
  const quantity = Number(current.quantity);
  const amount = Number(current.price.public);
  const totalPricePerOffer = quantity * amount;
  return totalPricePerOffer + prev;
};

export interface FacilityGroupOffersSummaryProps {
  roomCount: number;
  height: number;
  nightCount: number;
  guestCount: number;
}

export const FacilityGroupOffersSummary = ({
  height,
  roomCount,
  guestCount,
  nightCount
}: FacilityGroupOffersSummaryProps) => {
  const { watch } = useFormContext();
  const values = watch();
  const totalPrice = values.offers.reduce(getTotalPrice, 0).toFixed(2);
  const theme = useTheme();
  const currency = values.offers[0].price?.currency;

  return (
    <Stack
      direction={{ xs: 'row', md: 'column' }}
      sx={{
        height,
        backgroundColor: theme.palette.background.default,
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <Grid container sx={{ position: 'absolute', top: theme.spacing(1) }}>
        <Grid item xs={6} md={12}>
          <Box>
            <Typography component="span" variant="h5">
              {totalPrice}
              {'  '}
            </Typography>
            <Typography sx={{ fontWeight: 'normal' }} component="span" variant="h5">
              {currency}
            </Typography>
            <Tooltip
              enterTouchDelay={0}
              placement="top"
              title="You will have to pay a deposit value 10% from the estimated price. In case you do not proceed with our offer you will be eligible for a full refund. Read more about this process here Deposit policy and Refund"
            >
              <IconButtonAnimate color="primary" size="small">
                <Iconify icon="eva:info-outline" width={16} height={16} />
              </IconButtonAnimate>
            </Tooltip>
          </Box>

          <Stack direction="row">
            <Typography variant="body2">
              {`${nightCount} nights, ${roomCount} rooms and ${guestCount} guests`}{' '}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={6} md={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 1, zIndex: 1 }}
            size="large"
          >
            Request quote
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
};
