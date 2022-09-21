import type { RoomTypes } from '@windingtree/glider-types/types/win';
import type { OfferRecord } from 'src/store/types';
import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import { daysBetween } from 'src/utils/date';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';
import { RoomInformation } from './RoomInformation';
import { RHFTextField } from 'src/components/hook-form';

export const RoomCardGroup: React.FC<{
  room: RoomTypes;
  offer: OfferRecord;
  facilityId: string;
}> = ({ offer, facilityId, room }) => {
  const { latestQueryParams } = useAccommodationsAndOffers();
  const arrival = latestQueryParams?.arrival;
  const departure = latestQueryParams?.departure;
  const numberOfDays = daysBetween(arrival, departure);
  const roomsNumber = latestQueryParams?.roomCount;

  return (
    <Box mb={5}>
      <Divider />
      <Box py={5}>
        <Grid container spacing={5}>
          <Grid item xs={8}>
            <RoomInformation room={room} />
          </Grid>
          <Grid item xs={4} alignSelf="end">
            <Stack spacing={1} sx={{ textAlign: 'right' }}>
              <Typography>Select rooms</Typography>

              {/* Include a select input */}
              <Typography>
                {`Price for ${numberOfDays} nights, ${roomsNumber} room(s)`}
              </Typography>
              <RHFTextField
                key={offer.id}
                name={`offers[${offer.id}].id`}
                size="small"
                type="number"
                InputProps={{
                  type: 'number',
                  inputMode: 'numeric',
                  inputProps: {
                    min: 1
                  }
                }}
              />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
