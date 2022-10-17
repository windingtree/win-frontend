import type { RoomTypes, WinPricedOffer } from '@windingtree/glider-types/dist/win';
import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo, useState } from 'react';
import axios from 'axios';
import type { OfferRecord } from 'src/store/types';
import { Box, Divider, Grid, Typography, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { daysBetween } from 'src/utils/date';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers';
import { useAppDispatch } from 'src/store';
import { PricedOfferRequest } from 'src/api/PricedOffer';
import Logger from 'src/utils/logger';
import { RoomInformation } from './RoomInformation';
import { useCheckout } from 'src/hooks/useCheckout';
import { useSnackbar } from 'notistack';

const logger = Logger('RoomCard');

export const RoomCard: React.FC<{
  room: RoomTypes;
  offer: OfferRecord;
  facilityId: string;
}> = ({ offer, facilityId, room }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { latestQueryParams, getAccommodationById, accommodations } =
    useAccommodationsAndOffers();
  const arrival = latestQueryParams?.arrival;
  const departure = latestQueryParams?.departure;
  const navigate = useNavigate();
  const numberOfDays = daysBetween(arrival, departure);
  const roomsNumber = latestQueryParams?.roomCount;
  const [loading, setLoading] = useState<boolean>(false);
  const { setBookingInfo, setOrganizerInfo } = useCheckout();
  const { enqueueSnackbar } = useSnackbar();
  const accommodation = useMemo(
    () => getAccommodationById(accommodations, facilityId),
    [accommodations, facilityId]
  );

  const handleBook = useCallback(async () => {
    try {
      setLoading(true);

      if (!accommodation) return;

      if (!arrival || !departure) {
        enqueueSnackbar('Please fill in an arrival and departure date to continue.', {
          variant: 'error'
        });
        return;
      }

      //TODO: move this to the useCheckout hook
      const res = await axios.request<WinPricedOffer>(new PricedOfferRequest(offer.id));

      if (res.data) {
        setOrganizerInfo(undefined);
        setBookingInfo(
          {
            //TODO: review whether passing the quote is still needed
            quote: res.data.quote,
            accommodation,
            expiration: res.data.offer.expiration,
            date: {
              arrival,
              departure
            },
            pricing: {
              offerCurrency: {
                amount: res.data.offer.price.public,
                currency: res.data.offer.price.currency
              },
              // Currently the sourceAmount that we are getting back is always USD, therefore `usd` is hardcoded.
              // BE is likely to update the data structure the same way as for group booking, in the mean time we hardcode the usd value like this.
              usd: res.data.quote?.sourceAmount
            },
            adultCount: latestQueryParams?.adultCount,
            serviceId: res.data.serviceId,
            providerId: res.data.provider,
            offers: [{ offerId: res.data.offerId, quantity: 1 }]
          },
          true
        );

        logger.info('Get priced offer successfully');
        navigate('/guest-info');
      } else {
        throw new Error('Somethin went wrong!');
      }
    } catch (error) {
      enqueueSnackbar('Oops, something has gone wrong. Please try again.', {
        variant: 'error'
      });
      setLoading(false);
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
                {`${offer.price.currency} ${offer.price.public} `}
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
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
