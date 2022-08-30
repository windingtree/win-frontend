import * as Yup from 'yup';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PersonalInfoRequest } from '../api/PersonalInfoRequest';
import Logger from '../utils/logger';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Card, Checkbox, Grid, Link, Stack, Typography } from '@mui/material';
import { useAppDispatch, useAppState } from '../store';
import { FormProvider, RHFTextField } from '../components/hook-form';
import type { PersonalInfo } from '../store/types';
import { RHFDatePicker } from '../components/hook-form/RHFDatePicker';
import { regexp } from '@windingtree/org.id-utils';
import { convertToLocalTime } from '../utils/date';

const logger = Logger('GuestInfoContainer');

const defaultValues = {
  firstname: '',
  lastname: '',
  birthdate: null,
  email: '',
  phone: ''
};

export const GuestInfoContainer = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { checkout } = useAppState();

  const NewUserSchema = Yup.object().shape({
    firstname: Yup.string()
      .trim()
      .matches(/^[a-z ,.'-]+$/i, 'Only a-z, A-Z chars')
      .required('First name is required'),
    lastname: Yup.string()
      .trim()
      .matches(/^[a-z ,.'-]+$/i, 'Only a-z, A-Z chars')
      .required('Last name is required'),
    email: Yup.string()
      .trim()
      .required('Email is required')
      .matches(regexp.email, 'Incorrect email')
      .email(),
    phone: Yup.string()
      .trim()
      .matches(regexp.phone, 'Incorrect phone number')
      .required('Phone number is required'),
    birthdate: Yup.date()
      // .matches(regexp.isoDate, 'Incorrect date')
      .required('Birthdate is required')
  });

  const [privacy, setPrivacy] = useState<boolean>(false);
  const [error, setError] = useState<undefined | string>();

  const methods = useForm<PersonalInfo>({
    resolver: yupResolver(NewUserSchema),
    defaultValues
  });

  const {
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const onSubmit = useCallback(
    async (values: PersonalInfo) => {
      logger.info('submit user data', values);
      try {
        setError(undefined);

        if (checkout === undefined) {
          throw Error('Priced offer undefined');
        }
        if (!checkout.offerId) {
          throw Error('Priced offer offerId not defined');
        }
        if (values.birthdate === null) {
          throw Error('Birth date is not defined');
        }

        const formattedDate = convertToLocalTime(values.birthdate);
        await axios
          .request(
            new PersonalInfoRequest(checkout.offerId, {
              ...values,
              birthdate: formattedDate
            })
          )
          .catch(() => {
            throw Error('Something went wrong');
          });

        dispatch({
          type: 'SET_CHECKOUT',
          payload: {
            ...checkout,
            personalInfo: { ...values, birthdate: formattedDate }
          }
        });

        logger.info('Guest info sent successfully');
        navigate('/checkout/' + checkout.offerId);
      } catch (error) {
        const message = (error as Error).message || 'Unknown error';
        setError(message);
      }
    },
    [checkout, setError]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid justifyContent="center" container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography textAlign="center" sx={{ m: 2 }}>
            This Information will be strictly used by the hotel and win.so to confirm your
            booking! It is mandatory in order for the hotel to reserve your room.
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <Card sx={{ my: 2, p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }
              }}
            >
              <RHFTextField name="firstname" label="First Name" />
              <RHFTextField name="lastname" label="Last Name" />
              <RHFDatePicker name="birthdate" label="Birth date" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="phone" label="Phone Number" />
            </Box>
            <Stack direction="row" alignItems="flex-start" sx={{ mt: 3 }}>
              <Checkbox checked={privacy} onChange={() => setPrivacy(!privacy)} />
              <Box>
                <Typography variant="subtitle1">
                  <Link href="/privacy" underline="hover" target="_blank" rel="noopener">
                    win.so policies
                  </Link>
                </Typography>
                <Typography>
                  Please agree to win.so general terms for travellers. Curious about how
                  we handle your personal data? Read win.so privacy and cookie statement.
                </Typography>
              </Box>
            </Stack>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                disableElevation
                disabled={!privacy}
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Proceed to Payment
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
};
