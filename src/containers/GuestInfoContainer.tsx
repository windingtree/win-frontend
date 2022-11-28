import * as Yup from 'yup';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PersonalInfoRequest } from '../api/PersonalInfoRequest';
import Logger from '../utils/logger';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Card, Checkbox, Link, Stack, Typography } from '@mui/material';
import { FormProvider, RHFTextField } from '../components/hook-form';
import { RHFPhoneField } from '../components/hook-form/RHFPhoneField';
import type { PersonalInfo } from '../store/types';
import { RHFDatePicker } from '../components/hook-form/RHFDatePicker';
import { regexp } from '@windingtree/org.id-utils';
import { convertToLocalTime } from '../utils/date';
import { DateTime } from 'luxon';
import { useCheckout } from 'src/hooks/useCheckout';
import { useSnackbar } from 'notistack';

const logger = Logger('GuestInfoContainer');

const defaultValues = {
  firstName: '',
  lastName: '',
  birthdate: null,
  emailAddress: '',
  phoneNumber: ''
};

const NewUserSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .matches(/^[a-z ,.'-]+$/i, 'Only a-z, A-Z chars')
    .required('First name is required'),
  lastName: Yup.string()
    .trim()
    .matches(/^[a-z ,.'-]+$/i, 'Only a-z, A-Z chars')
    .required('Last name is required'),
  emailAddress: Yup.string()
    .trim()
    .required('Email is required')
    .matches(regexp.email, 'Incorrect email')
    .email(),
  phoneNumber: Yup.string()
    .trim()
    .matches(/^\+[1-9]\d{1,14}$/, 'Incorrect phone number')
    .required('Phone number is required'),
  birthdate: Yup.date()
    .typeError('Please enter a valid birth date')
    .test('birthdate', 'Should be more than 18', (value) => {
      if (value === undefined) {
        return false;
      }
      const birthdate = DateTime.fromJSDate(value);
      const today = DateTime.now();
      const diff = today.diff(birthdate, ['years']);
      return diff.years >= 18;
    })
    .required('Birthdate is required')
});

export const GuestInfoContainer = () => {
  const navigate = useNavigate();
  const { setOrganizerInfo, organizerInfo, bookingInfo } = useCheckout();
  const [privacy, setPrivacy] = useState<boolean>(false);
  const [error, setError] = useState<undefined | string>();
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<PersonalInfo>({
    resolver: yupResolver(NewUserSchema),
    defaultValues: organizerInfo ?? defaultValues
  });

  const {
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const onSubmit = useCallback(
    async (values: PersonalInfo) => {
      logger.debug('submit user data', values);
      const accommodationId = bookingInfo?.accommodation?.id;

      try {
        setError(undefined);

        if (!accommodationId || !values.birthdate || !bookingInfo.pricedOfferId) {
          enqueueSnackbar(
            'Something went wrong with your booking. Please try to select your room again.',
            {
              variant: 'error'
            }
          );
          return;
        }

        //TODO: move this to the useCheckout hook
        const formattedDate = convertToLocalTime(values.birthdate);
        await axios
          .request(
            new PersonalInfoRequest(bookingInfo.pricedOfferId, {
              ...values,
              birthdate: formattedDate
            })
          )
          .catch(() => {
            throw Error('Something went wrong');
          });

        setOrganizerInfo({ ...values, birthdate: formattedDate });
        logger.debug('Guest info sent successfully');
        navigate('/checkout/' + accommodationId);
      } catch (error) {
        const message = (error as Error).message || 'Unknown error';
        setError(message);
      }
    },
    [bookingInfo, enqueueSnackbar, navigate, setOrganizerInfo]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {error && <Alert severity="error">{error}</Alert>}
      <Card sx={{ my: 3, p: { xs: 1, md: 3 } }}>
        <Typography sx={{ mb: 2 }}>
          This Information will be strictly used by the hotel and win.so to confirm your
          booking! It is mandatory in order for the hotel to reserve your room.
        </Typography>
        <Stack spacing={3}>
          <RHFTextField name="firstName" label="First Name" />
          <RHFTextField name="lastName" label="Last Name" />
          <RHFDatePicker name="birthdate" label="Birth date" />
          <RHFTextField name="emailAddress" label="Email Address" />
          <RHFPhoneField name="phoneNumber" label="Phone Number" />
        </Stack>
        <Stack direction="row" alignItems="flex-start" sx={{ mt: 3 }}>
          <Checkbox checked={privacy} onChange={() => setPrivacy(!privacy)} />
          <Box>
            <Typography variant="subtitle1">I agree with terms and conditions</Typography>
            <Typography>
              I have read and approved win.so&nbsp;
              <Link href="/terms" underline="hover" target="_blank" rel="noopener">
                General Terms & Conditions
              </Link>
              &nbsp;for travellers and&nbsp;
              <Link href="/privacy" underline="hover" target="_blank" rel="noopener">
                Privacy and Cookie Statement
              </Link>
              .
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
    </FormProvider>
  );
};
