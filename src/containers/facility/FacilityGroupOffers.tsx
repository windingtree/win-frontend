import { Box, Button, Stack, Typography, Grid } from '@mui/material';
import { HEADER } from 'src/config/componentSizes';
import { RoomCardGroup } from './RoomCard/RoomCardGroup';
import { FormProvider } from 'src/components/hook-form';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useMemo } from 'react';

export const GroupOffersSchema = Yup.object().shape({
  offers: Yup.array().of(
    Yup.object().shape({
      // CHECK whether offerId also needs to be passed
      //   offerId: string(),
      quantity: Yup.string()
    })
  )
});

type FormValuesProps = {
  offers: Array<{ id: string; quantity: string }>;
};

export const FacilityGroupOffers = ({ offers, accommodation, facilityId }) => {


  const testOffers = [
    {
      id: '1234',
      quantity: '1'
    },
    {
      id: '1234',
      quantity: '1'
    }
  ];

  const defaultValues: FormValuesProps = useMemo(
    () => ({
      offers: offers.map(({id})=> { id, quantity: 0})
    }),
    [testOffers]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(GroupOffersSchema),
    defaultValues
  });

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors }
  } = methods;
  const values = watch();

  const { fields: offerFields } = useFieldArray({
    control,
    name: 'offers'
  });

  const onSubmit = (values) => {
    console.log(values);
  };

  console.log('values', values);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {offers?.map((offer, index) => {
            const accommodationOfOffer = Object.values(offer.pricePlansReferences)[0];
            const roomId: string = accommodationOfOffer?.roomType || '';
            const rooms = accommodation?.roomTypes || {};
            const matchedRoomWithOffer = rooms[roomId];

            // console.log(offers, accommodation);
            return (
              <RoomCardGroup
                key={index}
                facilityId={facilityId}
                offer={offer}
                room={matchedRoomWithOffer}
              />
            );
          })}
        </Grid>
        <Grid item xs={6} md={4}>
          <Box
            sx={{ position: { md: 'sticky' }, top: { md: HEADER.MAIN_DESKTOP_HEIGHT } }}
          >
            {/* //TODO: calculate the total amount of nights and adults */}
            <Typography>Total Price for X nights per X rooms and X adults</Typography>
            <Typography variant="h5">2540</Typography>
            <Typography mb={2}>Estimated price</Typography>
            <Typography variant="caption">
              You will have to pay a deposit value 10% from the estimated price. In case
              you do not proceed with our offer you will be eligible for a full refund.
              Read more about this process here Deposit policy & Refund{' '}
            </Typography>
            {/* TODO: on submit store the offers in a state */}
            <Button variant="contained" fullWidth sx={{ mt: 1 }} size="large">
              Request a quotation
            </Button>
          </Box>
        </Grid>
      </Grid>
    </FormProvider>
  );
};
