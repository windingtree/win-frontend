import type { RoomTypes, PricedOffer } from '@windingtree/glider-types/types/win';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { useCallback, useState } from 'react';
import Logger from '../utils/logger';
import axios from 'axios';
import { MessageBox } from './MessageBox';
import { PricedOfferRequest } from '../api/PricedOffer';
import type { OfferRecord } from 'src/store/types';
import { Alert, Box, Grid, Typography, useTheme } from '@mui/material';

import { CustomLoadingButton } from './CustomLoadingButton';

const logger = Logger('RoomCard');

export const RoomCard: React.FC<{
  room: RoomTypes;
  offer: OfferRecord;
  facilityId: string;
}> = ({ offer, facilityId, room }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const navigate = useNavigate();
  const [notification] = useState<string | undefined>();
  const numberOfDays = 1;
  const roomsNumber = 1;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<undefined | string>();

  const handleBook = useCallback(async () => {
    try {
      setError(undefined);
      setLoading(true);

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
    <Box border={'3px solid #AAAAAA'} padding={theme.spacing(2)} borderRadius={1} marginBottom={theme.spacing(5)}>
      <Grid container spacing={5}>
        <Grid item xs={9}>
          <Box>
            <Typography variant="h4" marginBottom={theme.spacing(2)}>
              {room?.name}
            </Typography>
            {room?.maximumOccupancy && (
              <Typography variant="body1" marginBottom={theme.spacing(1)}>
                {`Book your ${room?.name} for `}
                {room?.maximumOccupancy?.adults}{' '}
                {room?.maximumOccupancy?.adults !== undefined &&
                room?.maximumOccupancy?.adults > 1
                  ? 'adults'
                  : 'adult'}
                , {room?.maximumOccupancy?.children}{' '}
                {room?.maximumOccupancy?.children !== undefined &&
                room?.maximumOccupancy?.children > 1
                  ? 'children'
                  : 'child'}
              </Typography>
            )}
          </Box>
          <Box flexDirection={'column'} justifyContent={'start'}>
            <Typography variant="body1">{room?.description}</Typography>
          </Box>
        </Grid>
        <Grid item xs={3} alignSelf={'end'}>
          <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'end'}
            rowGap={theme.spacing(2)}
          >
            <Typography variant="body1">
              {`${offer.price?.currency} ${Number(offer.price?.public).toFixed(2)} `}
            </Typography>
            <Typography>
              {`Price for ${numberOfDays} nights, ${roomsNumber} room(s)`}
            </Typography>
            <CustomLoadingButton
              onClick={() => handleBook()}
              loading={loading}
            >
              Book Now
            </CustomLoadingButton>
            <MessageBox type="error" show={!!error}>
              {error}
            </MessageBox>
          </Box>
        </Grid>
      </Grid>

      {notification && (
        <Alert
          sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}
          severity="warning"
        >
          {notification}
        </Alert>
      )}
    </Box>
  );
};
