import type { RoomTypes, PricedOffer } from '@windingtree/glider-types/types/win';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { useCallback, useState } from 'react';
import Logger from '../utils/logger';
import axios from 'axios';
import { MessageBox } from './MessageBox';
import { PricedOfferRequest } from '../api/PricedOffer';
import type { OfferRecord } from 'src/store/types';
import { Alert, Box, Grid, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ctaButtonStyle } from '../containers/facility/CtaButton';

const logger = Logger('RoomCard');

export const RoomCard: React.FC<{
  room: RoomTypes;
  offer: OfferRecord;
  facilityId: string;
}> = ({ offer, facilityId, room }) => {
  const dispatch = useAppDispatch();

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
    <Box border={"3px solid #AAAAAA"} padding={"20px"} borderRadius={"5px"}>
      <Grid container spacing={5}>
        <Grid item xs={9}>
          <Box>
            <Typography fontSize={"2rem"} marginBottom={"12px"}>
              {room?.name}
            </Typography>
            {room?.maximumOccupancy && (
              <Typography fontSize={"1rem"} marginBottom={"6px"}>
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
          <Box flexDirection={"column"} justifyContent={"start"}>
            <Typography fontSize={"1rem"}>{room?.description}</Typography>
          </Box>
        </Grid>
        <Grid item xs={3} alignSelf={"end"}>
          <Box display={"flex"} flexDirection={"column"} alignItems={"end"} rowGap={"10px"}>
            <Typography fontSize={"1.5rem"}>
            {`${
              offer.price?.currency
            } ${Number(offer.price?.public).toFixed(2)} `}
            </Typography>
            <Typography>
              {`Price for ${numberOfDays} nights, ${roomsNumber} room(s)`}
            </Typography>
            <LoadingButton
              onClick={() => handleBook()}
              loading={loading}
              sx={ctaButtonStyle}
            >Book Now</LoadingButton>               
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
