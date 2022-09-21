import type { RoomTypes, PricedOffer } from '@windingtree/glider-types/types/win';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import axios from 'axios';
import type { OfferRecord } from 'src/store/types';
import { Alert, Box, Divider, Grid, Typography, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { daysBetween } from 'src/utils/date';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';
import { useAppDispatch } from 'src/store';
import { PricedOfferRequest } from 'src/api/PricedOffer';
import Logger from 'src/utils/logger';
import { RoomInformation } from './RoomInformation';

const logger = Logger('RoomCard');

export const RoomCard: React.FC<{
  room: RoomTypes;
  offer: OfferRecord;
  facilityId: string;
}> = ({ offer, facilityId, room }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { latestQueryParams } = useAccommodationsAndOffers();
  const arrival = latestQueryParams?.arrival;
  const departure = latestQueryParams?.departure;
  const navigate = useNavigate();
  const numberOfDays = daysBetween(arrival, departure);
  const roomsNumber = latestQueryParams?.roomCount;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<undefined | string>();

  //TODO: consider including this in a seperate hook
  const handleBook = useCallback(async () => {
    try {
      setError(undefined);
      setLoading(true);

      //TODO: check how we have to do this request if multipel rooms are being selected.
      const res = await axios.request<PricedOffer>(new PricedOfferRequest(offer.id));

      if (res.data) {
        dispatch({
          type: 'SET_CHECKOUT',
          payload: {
            facilityId,
            ...res.data
          }
        });

        logger.info('Get priced offer successfully');
        navigate('/guest-info');
      } else {
        throw new Error('Somethin went wrong!');
      }
    } catch (error) {
      const message = (error as Error).message || 'Unknown useAuthRequest error';
      setLoading(false);
      setError(message);
    }
  }, [dispatch]);

  return (
    <Box mb={5}>
      <Divider />
      <Box py={5}>
        <Grid container spacing={5}>
          <Grid item xs={8}>
            <RoomInformation room={room} />
          </Grid>
          <Grid item xs={4} alignSelf={'end'}>
            <Box
              display={'flex'}
              flexDirection={'column'}
              alignItems={'end'}
              rowGap={theme.spacing(2)}
            >
              <Typography variant="body1" textAlign={'right'}>
                {`${offer.price?.currency} ${Number(offer.price?.public).toFixed(2)} `}
              </Typography>
              <Typography textAlign={'right'}>
                {`Price for ${numberOfDays} nights, ${roomsNumber} room(s)`}
              </Typography>

              <LoadingButton
                disableElevation
                variant="contained"
                size="large"
                onClick={() => handleBook()}
                loading={loading}
                sx={{
                  whiteSpace: 'nowrap'
                }}
              >
                Book Now
              </LoadingButton>

              {error && (
                <Alert
                  sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}
                  severity="warning"
                >
                  {error}
                </Alert>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
