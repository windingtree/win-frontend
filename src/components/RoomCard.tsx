import type { RoomTypes, WinPricedOffer } from '@windingtree/glider-types/dist/win';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { useCallback, useState } from 'react';
import Logger from '../utils/logger';
import axios from 'axios';
import { MessageBox } from './MessageBox';
import { PricedOfferRequest } from '../api/PricedOffer';
import type { OfferRecord } from 'src/store/types';
import { Alert, Box, Grid, Typography, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { daysBetween } from '../utils/date';
import { useAccommodationsAndOffers } from '../hooks/useAccommodationsAndOffers.tsx';

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
  const [notification] = useState<string | undefined>();
  const numberOfDays = daysBetween(arrival, departure);
  const roomsNumber = latestQueryParams?.roomCount;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<undefined | string>();

  const handleBook = useCallback(async () => {
    try {
      setError(undefined);
      setLoading(true);

      const res = await axios.request<WinPricedOffer>(new PricedOfferRequest(offer.id));

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
        throw new Error('Something went wrong!');
      }
    } catch (error) {
      const message = (error as Error).message || 'Unknown useAuthRequest error';
      setLoading(false);
      setError(message);
    }
  }, [dispatch]);

  return (
    <Box
      borderTop={'3px solid black'}
      py={theme.spacing(5)}
      marginBottom={theme.spacing(5)}
    >
      <Grid container spacing={5}>
        <Grid item xs={8}>
          <Box>
            <Typography variant="h4" marginBottom={theme.spacing(2)}>
              {room?.name}
            </Typography>
            {room?.maximumOccupancy && (
              <Typography variant="body1" marginBottom={theme.spacing(1)}>
                {`Book your ${room?.name} `}
                {!room?.maximumOccupancy?.adults
                  ? ''
                  : room?.maximumOccupancy?.adults > 1
                  ? `for ${room?.maximumOccupancy?.adults} adults`
                  : `for ${room?.maximumOccupancy?.adults} adult`}
                {!room?.maximumOccupancy?.children
                  ? ''
                  : room?.maximumOccupancy?.children > 1
                  ? ` and ${room?.maximumOccupancy?.children} children`
                  : ` and ${room?.maximumOccupancy?.children} child`}
              </Typography>
            )}
          </Box>
          <Box flexDirection={'column'} justifyContent={'start'}>
            <Typography variant="body1">{room?.description}</Typography>
          </Box>
        </Grid>
        <Grid item xs={4} alignSelf={'end'}>
          <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'end'}
            rowGap={theme.spacing(2)}
          >
            <Typography variant="body1" textAlign={'right'}>
              {`${offer.price?.currency} ${offer.price?.public} `}
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
