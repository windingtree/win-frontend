import type {
  WinAccommodation,
  WinPricedOffer
} from '@windingtree/glider-types/dist/win';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import axios from 'axios';
import type { OfferRecord } from 'src/store/types';
import { Box, Grid, Divider, Typography, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { daysBetween } from 'src/utils/date';
import { PricedOfferRequest } from 'src/api/PricedOffer';
import Logger from 'src/utils/logger';
import { OfferInformation } from './shared/OfferInformation';
import { useCheckout } from 'src/hooks/useCheckout';
import { useSnackbar } from 'notistack';
import { useCurrencies } from '../../../../hooks/useCurrencies';
import { useUserSettings } from '../../../../hooks/useUserSettings';
import { displayPriceFromPrice } from '../../../../utils/price';
import { SearchPropsType } from 'src/hooks/useAccommodationSingle';

const logger = Logger('OfferItemSelectOne');

export const OfferItemSelectOne: React.FC<{
  offer: OfferRecord;
  accommodation: WinAccommodation;
  latestQueryParams: SearchPropsType;
}> = ({ offer, accommodation, latestQueryParams }) => {
  const { roomCount, arrival, departure, adultCount } = latestQueryParams;
  const theme = useTheme();
  const navigate = useNavigate();
  const numberOfDays = daysBetween(arrival, departure);
  const [loading, setLoading] = useState<boolean>(false);
  const { setBookingInfo, setOrganizerInfo } = useCheckout();
  const { enqueueSnackbar } = useSnackbar();
  const { convertPriceCurrency } = useCurrencies();
  const { preferredCurrencyCode } = useUserSettings();

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
            adultCount: adultCount,
            serviceId: res.data.serviceId,
            providerId: res.data.provider,
            pricedOfferId: res.data.offerId,
            offers: [{ ...offer, ...res.data.offer, quantity: '1' }]
          },
          true
        );

        logger.info('Get priced offer successfully');
        navigate('/guest-info');
      } else {
        throw new Error('Something went wrong!');
      }
    } catch (error) {
      enqueueSnackbar('Oops, something has gone wrong. Please try again.', {
        variant: 'error'
      });
      setLoading(false);
    }
  }, [
    accommodation,
    adultCount,
    arrival,
    departure,
    enqueueSnackbar,
    navigate,
    offer,
    setBookingInfo,
    setOrganizerInfo
  ]);

  // convert price to user preferred currency or keep local when not available
  const localPrice = offer.price;
  const preferredCurrencyPrice = convertPriceCurrency({
    price: localPrice,
    targetCurrency: preferredCurrencyCode,
    amount: roomCount || 1
  });
  const price = preferredCurrencyPrice ?? localPrice;
  return (
    <Box mb={5}>
      <Divider />
      <Box py={5}>
        <Grid container spacing={5}>
          <Grid item xs={8}>
            <OfferInformation room={offer.room} offer={offer} />
          </Grid>
          <Grid item xs={4} alignSelf={'end'}>
            <Box
              display={'flex'}
              flexDirection={'column'}
              alignItems={'end'}
              rowGap={theme.spacing(2)}
            >
              <Typography variant="body1" textAlign={'right'}>
                {/* {`${offer.price.currency} ${offer.price.public} `} */}
                {displayPriceFromPrice(price)}
              </Typography>
              <Typography textAlign={'right'}>
                {`Price for ${numberOfDays} nights, ${roomCount} ${
                  roomCount === 1 ? 'room' : 'rooms'
                }`}
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
