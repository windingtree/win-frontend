import { Grid } from '@mui/material';
import { RoomCardGroup } from './RoomCardGroup';
import { FormProvider } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { FacilityGroupOffersSummary } from './FacilityGroupOffersSummary';
import type { AccommodationType } from '@windingtree/glider-types/dist/win';
import type { OfferRecord } from 'src/store/types';

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
  offers: OfferRecord[];
  accommodation: AccommodationType;
}

interface OfferFormType extends OfferRecord {
  quantity: string;
}

type FormValuesProps = {
  offers: OfferFormType[];
};

export const FacilityGroupOffers = ({
  offers,
  accommodation
}: FacilityGroupOffersProps) => {
  const defaultValues: FormValuesProps = useMemo(
    () => ({
      offers: offers.map((offer) => ({
        ...offer,
        quantity: '0'
      }))
    }),
    [offers]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(GroupOffersSchema),
    defaultValues
  });

  const {
    handleSubmit,
    formState: { errors }
  } = methods;

  // TODO: on submit store the offers in a state
  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
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
        <Grid item xs={6} md={4}>
          <FacilityGroupOffersSummary />
        </Grid>
      </Grid>
    </FormProvider>
  );
};
