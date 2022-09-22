import { Grid } from '@mui/material';
import { RoomCardGroup } from './RoomCard/RoomCardGroup';
import { FormProvider } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { FacilityGroupOffersSummary } from './FacilityGroupOffersSummary';

export const GroupOffersSchema = Yup.object().shape({
  offers: Yup.array().of(
    Yup.object().shape({
      id: Yup.string(),
      quantity: Yup.string()
    })
  )
});

type FormValuesProps = {
  offers: Array<{ id: string; quantity: string }>;
};

export const FacilityGroupOffers = ({ offers, accommodation, facilityId }) => {
  const normalizedOffersForForm = offers.map((offer) => ({
    offerId: offer.id,
    quantity: '0'
  }));

  const defaultValues: FormValuesProps = useMemo(
    () => ({
      offers: normalizedOffersForForm
    }),
    [offers]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(GroupOffersSchema),
    defaultValues
  });

  const {
    watch,
    handleSubmit,
    formState: { errors }
  } = methods;
  const values = watch();

  const onSubmit = (values) => {
    console.log(values);
  };

  console.log(values);

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
                facilityId={facilityId}
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
