import type { RoomTypes } from '@windingtree/glider-types/dist/win';
import type { OfferRecord } from 'src/store/types';
import { Box, Divider, Grid, Stack, TextField, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { RoomInformation } from '../RoomInformation';
import { currencySymbolMap } from '../../../utils/currencies';

export interface FacilityGalleryProps {
  offer: OfferRecord;
  room: RoomTypes;
}

export const RoomCardGroup: React.FC<{
  room: RoomTypes;
  offer: OfferRecord;
  index: number;
  nightCount: number;
}> = ({ offer, room, index, nightCount }) => {
  const { register } = useFormContext();
  const pricePerNight: number = Number(offer.price.public) / nightCount;
  const currencySymbol = currencySymbolMap[offer.price.currency] ?? offer.price.currency;

  return (
    <Box>
      <Divider />
      <Box py={5}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <RoomInformation room={room} />
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
                  {`${currencySymbol} ${pricePerNight.toFixed(2)}`}
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
                  >{`${currencySymbol} ${offer.price.public}`}</Typography>
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
