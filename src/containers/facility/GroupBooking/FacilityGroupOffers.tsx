import { Alert, Grid, Snackbar, Typography } from '@mui/material';
import { RoomCardGroup } from './RoomCardGroup';
import { FormProvider } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useMemo, useState } from 'react';
import { FacilityGroupOffersSummary } from './FacilityGroupOffersSummary';
import type { OfferRecord } from 'src/store/types';
import { AccommodationWithId } from 'src/hooks/useAccommodationsAndOffers.tsx/helpers';
import { yupResolver } from '@hookform/resolvers/yup';
import { HEADER } from 'src/config/componentSizes';
import useResponsive from 'src/hooks/useResponsive';

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

interface FacilityGroupOffersProps {
  offers: OfferRecord[] | null;
  accommodation: AccommodationWithId | null;
}

/**
 * Instead of using an OfferType we create seperate type for the form,
 * because react-hook-form is otherwise complaining about the dynamic types.
 */
type FormOfferType = {
  expiration?: string;
  price?: {
    currency: string;
    private?: string;
    public: string;
    commission?: string;
    taxes?: string;
    isAmountBeforeTax?: boolean;
    decimalPlaces?: number;
  };
  pricePlansReferences?: {
    [k: string]: {
      accommodation: string;
      roomType: string;
      roomTypePlan?: {
        mealPlan?: string;
        ratePlan?: string;
        roomTypeId: string;
      };
    };
  };
  quantity: string;
  id: string;
};

type FormValuesProps = {
  offers: FormOfferType[];
};

const getRoomCount = (prev: number, current: FormOfferType): number =>
  Number(current.quantity) + prev;

export const FacilityGroupOffers = ({
  offers = [],
  accommodation
}: FacilityGroupOffersProps) => {
  const mappedOffers = useMemo(
    () =>
      offers?.map((offer) => ({
        ...offer,
        quantity: '0'
      })),

    [offers]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(GroupOffersSchema),
    defaultValues: { offers: mappedOffers }
  });

  const { handleSubmit, watch } = methods;
  const values = watch();
  const roomCount = values.offers.reduce(getRoomCount, 0);
  const [showError, setShowError] = useState(false);
  const isDesktop = useResponsive('up', 'md');
  const summaryBoxHeight = 130;

  const onSubmit = () => {
    if (roomCount < 10) {
      setShowError(true);
      return;
    }
  };

  const handleClose = () => {
    setShowError(false);
  };

  if (!offers) {
    return <Typography>No rooms available during the selected dates.</Typography>;
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={handleClose}
      >
        <Alert severity="error" sx={{ width: '100%' }} onClose={handleClose}>
          Please select more than 9 rooms to conduct a group booking.
        </Alert>
      </Snackbar>
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
          <FacilityGroupOffersSummary height={summaryBoxHeight} roomCount={roomCount} />
        </Grid>
        <Grid item xs={12} md={8} order={{ xs: 2, md: 1 }}>
          {offers?.map((offer, index) => {
            const accommodationOfOffer = Object.values(offer.pricePlansReferences)[0];
            const roomId: string = accommodationOfOffer?.roomType || '';
            const rooms = accommodation?.roomTypes || {};
            const matchedRoomWithOffer = rooms[roomId];

            return (
              <RoomCardGroup
                index={index}
                key={index}
                offer={offer}
                room={matchedRoomWithOffer}
              />
            );
          })}
        </Grid>
      </Grid>
    </FormProvider>
  );
};
