import { Box, Button, Typography, Stack, Grid, useTheme, Card } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import useResponsive from 'src/hooks/useResponsive';
import { OfferRecord } from 'src/store/types';
import { Link } from 'react-router-dom';
import { currencySymbolMap } from '../../../utils/currencies';

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
const Summary = ({
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
  const currencySymbol = currencySymbolMap[currency] ?? currency;

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
        <Box>
          <Typography variant="body2">
            {`Estimated total price for ${guestCount} adults, ${roomCount} rooms and ${nightCount} nights`}{' '}
          </Typography>
          <Typography component="span" variant="h5">
            {currencySymbol} {totalPrice}*
          </Typography>
        </Box>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 1, mb: 1, zIndex: 1 }}
          size="large"
        >
          Request quote
        </Button>
        <Typography variant="caption">
          *A 10% refundable deposit is required to finish the quotation process. Read more{' '}
          <Link to="/faq">here</Link>.
        </Typography>
      </Grid>
    </Stack>
  );
};
export const FacilityGroupOffersSummary = (props: FacilityGroupOffersSummaryProps) => {
  const isDesktop = useResponsive('up', 'md');

  if (isDesktop) {
    return (
      <>
        <Card sx={{ p: 2 }} elevation={4}>
          <Summary {...props} />
        </Card>
      </>
    );
  }

  return <Summary {...props} />;
};
