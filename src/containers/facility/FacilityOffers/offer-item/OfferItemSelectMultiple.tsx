import type { RoomTypes } from '@windingtree/glider-types/dist/win';
import type { OfferRecord } from 'src/store/types';
import { Box, Divider, Grid, Stack, TextField, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { OfferInformation } from './shared/OfferInformation';
import { displayPriceFromPrice, displayPriceFromValues } from '../../../../utils/price';

export const OfferItemSelectMultiple: React.FC<{
  room: RoomTypes;
  offer: OfferRecord;
  index: number;
  nightCount: number;
}> = ({ offer, room, index, nightCount }) => {
  const { register } = useFormContext();
  const price = offer.preferredCurrencyPrice ?? offer.price;
  const pricePerNight: number = Number(price.public) / nightCount;

  return (
    <Box>
      <Divider />
      <Box py={5}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <OfferInformation room={room} offer={offer} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack alignItems={{ md: 'flex-end' }} sx={{ textAlign: { md: 'end' } }}>
              <Typography>Select rooms</Typography>
              <TextField
                sx={{ width: 80 }}
                {...register(`offers.${index}.quantity`)}
                size="small"
                type="number"
                InputProps={{
                  type: 'number',
                  inputMode: 'numeric',
                  inputProps: {
                    min: 0
                  }
                }}
              />
              <Box mt={{ xs: 2, mb: 0 }}>
                <Typography
                  color="text.secondary"
                  variant="body2"
                  component="span"
                  fontWeight="bold"
                  sx={{ display: 'inline-block' }}
                >
                  {/* {`${currencySymbol} ${pricePerNight.toFixed(2)}`} */}
                  {displayPriceFromValues(pricePerNight, price.currency)}
                </Typography>
                <Typography color="text.secondary" variant="body2" component="span">
                  {' '}
                  / room / night
                </Typography>
              </Box>

              {nightCount > 1 && (
                <Box>
                  <Typography
                    sx={{ display: 'inline-block' }}
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    {displayPriceFromPrice(price)}
                  </Typography>
                  <Typography
                    sx={{ display: 'inline-block' }}
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    &nbsp;{`/ room / ${nightCount} nights`}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
