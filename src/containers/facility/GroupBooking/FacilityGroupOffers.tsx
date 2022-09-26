import { Grid, Typography } from '@mui/material';
import { RoomCardGroup } from './RoomCardGroup';
import { FormProvider } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { FacilityGroupOffersSummary } from './FacilityGroupOffersSummary';
import type { OfferRecord } from 'src/store/types';
import { AccommodationWithId } from 'src/hooks/useAccommodationsAndOffers.tsx/helpers';
import { yupResolver } from '@hookform/resolvers/yup';

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

type FormValuesProps = {
  offers: {
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
  }[];
};

export const FacilityGroupOffers = ({
  offers = [],
  accommodation
}: FacilityGroupOffersProps) => {
  const test = useMemo(() => {
    const mappedOffers =
      offers?.map((offer) => ({
        ...offer,
        quantity: '0'
      })) ?? [];

    return mappedOffers;
  }, [offers]);

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(GroupOffersSchema),
    defaultValues: { offers: test }
  });

  // const roomCount = values.offers.reduce(getRoomCount, 0);

  const { handleSubmit, watch } = methods;

  // TODO: on submit store the offers in a state
  const onSubmit = (values) => {
    console.log(values);
  };

  if (!offers)
    return <Typography>No rooms available during the selected dates.</Typography>;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
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
        <Grid item xs={12} md={4}>
          <FacilityGroupOffersSummary />
        </Grid>
      </Grid>
    </FormProvider>
  );
};
