import type { RoomTypes } from '@windingtree/glider-types/types/win';
import type { OfferRecord } from 'src/store/types';
import { Box, Divider, Grid, Stack, TextField, Typography } from '@mui/material';
import { daysBetween } from 'src/utils/date';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';
import { RoomInformation } from './RoomInformation';
import { RHFTextField } from 'src/components/hook-form';
import { useFormContext } from 'react-hook-form';

export const RoomCardGroup: React.FC<{
  room: RoomTypes;
  offer: OfferRecord;
  facilityId: string;
  index: number;
}> = ({ offer, facilityId, room, index }) => {
  const { register } = useFormContext();
  const price = `${offer.price?.currency} ${Number(offer.price?.public).toFixed(2)}`;

  return (
    <Box mb={5}>
      <Divider />
      <Box py={5}>
        <Grid container spacing={5}>
          <Grid item xs={8}>
            <RoomInformation room={room} />
          </Grid>
          <Grid item xs={4}>
            <Stack spacing={1} alignItems="flex-end" sx={{ textAlign: 'end' }}>
              <Typography>Select rooms</Typography>
              {/* TODO: Prevent a user from being able to select less than 0 when typing */}
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
              <Typography variant="body2">{`${price} Estimated price /room/night`}</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
