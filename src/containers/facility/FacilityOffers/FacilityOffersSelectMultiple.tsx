import { Box, Grid, Typography } from '@mui/material';
import { FormProvider } from 'src/components/hook-form';
import { useForm, FieldValues } from 'react-hook-form';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { FacilityOffersSelectMultipleSummary } from './FacilityOffersMultipleSummary';
import { yupResolver } from '@hookform/resolvers/yup';
import { HEADER } from 'src/config/componentSizes';
import { useResponsive } from 'src/hooks/useResponsive';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers';
import { daysBetween } from 'src/utils/date';
import { useCheckout } from 'src/hooks/useCheckout';
import { useNavigate, useParams } from 'react-router-dom';
import { getOffersWithQuantity, getSelectedOffers } from '../helpers';
import { useSnackbar } from 'notistack';
import { getRoomOfOffer, getTotalRoomCountReducer } from 'src/utils/offers';
import type { OfferRecord } from 'src/store/types';
import { MHidden } from 'src/components/MHidden';
import { OfferItemSelectMultiple } from './offer-item/OfferItemSelectMultiple';
import { GROUP_MODE_ROOM_COUNT } from 'src/config';
import { sortAccommodationOffersByPrice } from 'src/utils/accommodation';

export interface OfferCheckoutType extends OfferRecord {
  quantity: string;
}

/**
 * Only the quantity can be changed in the form by the User,
 * but all other properties of the offer object are also included as
 * 1. ) it is either needed for the or 2. to display certain UI towards the user
 */
export const GroupOffersSchema = Yup.object().shape({
  offers: Yup.array().of(
    Yup.object().shape({
      expiration: Yup.string(),
      id: Yup.string(),
      quantity: Yup.string(),
      price: Yup.object(),
      pricePlansReferences: Yup.object()
    })
  )
});

export type FacilityOffersSelectMultipleFormProps = {
  offers: OfferCheckoutType[];
};

export const FacilityOffersSelectMultiple = () => {
  const { getAccommodationById, accommodations, latestQueryParams } =
    useAccommodationsAndOffers();
  const params = useParams();
  const { setBookingInfo, setOrganizerInfo } = useCheckout();
  const isDesktop = useResponsive('up', 'md');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const id: string = params.id as string;
  const accommodation = useMemo(
    () => getAccommodationById(accommodations, id),
    [accommodations, getAccommodationById, id]
  );

  const offers = accommodation && sortAccommodationOffersByPrice(accommodation);

  const defaultRoomCount = latestQueryParams?.roomCount
    ? latestQueryParams.roomCount
    : GROUP_MODE_ROOM_COUNT;

  // ----------------------------------------------------------------------
  const defaultOffers = useMemo(
    () => getOffersWithQuantity(offers, defaultRoomCount),
    [offers, defaultRoomCount]
  );
  const methods = useForm<FacilityOffersSelectMultipleFormProps>({
    resolver: yupResolver(GroupOffersSchema),
    defaultValues: { offers: defaultOffers } as FieldValues
  });
  const { handleSubmit, watch } = methods;
  const values = watch();

  // ----------------------------------------------------------------------

  if (!latestQueryParams || !accommodation) return null;

  const { arrival, departure, adultCount, childrenCount, location } = latestQueryParams;
  const nightCount = daysBetween(arrival, departure);
  const guestCount = (adultCount ?? 0) + (childrenCount ?? 0);
  const roomCount = values.offers.reduce(getTotalRoomCountReducer, 0);
  const summaryBoxHeight = 210;

  const onSubmit = (values: FacilityOffersSelectMultipleFormProps) => {
    if (roomCount > guestCount) {
      return enqueueSnackbar(`Please select more persons than rooms to continue.`, {
        variant: 'error'
      });
    }

    if (roomCount < GROUP_MODE_ROOM_COUNT) {
      return enqueueSnackbar(
        `Please select ${GROUP_MODE_ROOM_COUNT} or more rooms to continue.`,
        {
          variant: 'error'
        }
      );
    }

    if (!arrival || !departure) {
      enqueueSnackbar('Please fill in an arrival and departure date to continue.', {
        variant: 'error'
      });
      return;
    }

    const selectedOffers = getSelectedOffers(values.offers);

    if (!accommodation) return;
    setOrganizerInfo(undefined);
    setBookingInfo(
      {
        location: location,
        accommodation,
        date: {
          arrival,
          departure
        },
        adultCount: adultCount,
        offers: selectedOffers
      },
      true
    );

    navigate('/org-details');
  };

  if (!offers || !accommodation) {
    return <Typography>No rooms available during the selected dates.</Typography>;
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid
          order={{ xs: 1, md: 2 }}
          item
          xs={12}
          md={4}
          sx={{
            zIndex: 9999,
            position: 'sticky',
            top: isDesktop
              ? HEADER.MAIN_DESKTOP_HEIGHT
              : `calc(100% - ${summaryBoxHeight}px)`,
            alignSelf: 'flex-start'
          }}
        >
          <FacilityOffersSelectMultipleSummary
            height={summaryBoxHeight}
            roomCount={roomCount}
            nightCount={nightCount}
            guestCount={guestCount}
          />
        </Grid>
        <Grid item xs={12} md={8} order={{ xs: 2, md: 1 }} sx={{ mt: 4 }}>
          <Box mt={{ xs: `-${summaryBoxHeight}px`, md: 0 }}>
            {offers?.map((offer, index) => {
              const room = getRoomOfOffer(accommodation, offer);
              return (
                <OfferItemSelectMultiple
                  index={index}
                  key={index}
                  offer={offer}
                  room={room}
                  nightCount={nightCount}
                />
              );
            })}

            <MHidden width="mdUp">
              <Box
                sx={{
                  width: '100%',
                  height: `${summaryBoxHeight}px`
                }}
              />
            </MHidden>
          </Box>
        </Grid>
      </Grid>
    </FormProvider>
  );
};
