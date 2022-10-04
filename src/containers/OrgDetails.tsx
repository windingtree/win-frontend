import * as Yup from 'yup';
import { useCallback, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Card,
  FormControlLabel,
  Checkbox,
  Link,
  Stack,
  Typography
} from '@mui/material';
import { useAppState, useAppDispatch } from '../store';
import {
  FormProvider,
  RHFTextField,
  RHFPhoneField,
  RHFAutocomplete,
  RHFCheckbox
} from '../components/hook-form';
import Iconify from '../components/Iconify';
import type { GroupCheckOut, OrganizerInfo } from '../store/types';
import { regexp } from '@windingtree/org.id-utils';
import { countries } from '../config';
import { isVatValid } from '../utils/vat';
import Logger from '../utils/logger';

const logger = Logger('OrgDetails');

const countriesOptions = countries.map((c) => c.label); // just countries names

const eeRegExp = /^(?<EE>((EE)?(?<NUM>[0-9]{9})))$/i;

export interface EeRegExp extends Array<string> {
  groups: {
    EE?: string;
    NUM?: string;
  };
}

const defaultValues: OrganizerInfo = {
  firstname: '',
  lastname: '',
  phone: '',
  email: '',
  companyName: '',
  country: '',
  city: '',
  streetName: '',
  vat: '',
  invoiceRequired: false
};

export const OrgDetails = () => {
  // const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { groupCheckout } = useAppState();
  const [vatValid, setVatValid] = useState<boolean>(false);
  const [privacy, setPrivacy] = useState<boolean>(false);
  const [error, setError] = useState<undefined | string>();

  const organizerSchema = Yup.object().shape({
    firstname: Yup.string()
      .trim()
      .matches(/^[a-z ,.'-]+$/i, 'Only a-z, A-Z chars')
      .required('First name is required'),
    lastname: Yup.string()
      .trim()
      .matches(/^[a-z ,.'-]+$/i, 'Only a-z, A-Z chars')
      .required('Last name is required'),
    phone: Yup.string()
      .trim()
      .matches(/^\+[1-9]\d{1,14}$/, 'Incorrect phone number')
      .required('Phone number is required'),
    email: Yup.string()
      .trim()
      .required('Email is required')
      .matches(regexp.email, 'Incorrect email')
      .email(),
    companyName: Yup.string().trim(),
    country: Yup.string()
      .trim()
      .test(
        'is-allowed-country',
        'Unknown country name',
        (value) =>
          value !== undefined && (value === '' || countriesOptions.includes(value))
      ),
    city: Yup.string().trim(),
    streetName: Yup.string().trim(),
    vat: Yup.string()
      .trim()
      .test('is-vat-valid', 'VAT number is not valid', async (value) => {
        if (value && value.length === 11) {
          const vatParsed = eeRegExp.exec(value) as EeRegExp | null;
          if (vatParsed?.groups.NUM) {
            const isValid = await isVatValid(vatParsed.groups.NUM);
            setVatValid(isValid);
            return isValid;
          }
        }
        return true;
      })
  });

  const methods = useForm<OrganizerInfo>({
    resolver: yupResolver(organizerSchema),
    defaultValues: groupCheckout?.organizerInfo ?? defaultValues
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  useEffect(() => {
    const subscription = watch((values) => {
      dispatch({
        type: 'SET_GROUP_CHECKOUT',
        payload: {
          ...groupCheckout,
          organizerInfo: {
            ...groupCheckout?.organizerInfo,
            ...values
          }
        } as GroupCheckOut
      });
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = useCallback(
    async (values: OrganizerInfo) => {
      logger.info('Submit organizer data', values);
      try {
        setError(undefined);

        // navigate('/checkout/' + ...);
      } catch (error) {
        const message = (error as Error).message || 'Unknown error';
        setError(message);
      }
    },
    [groupCheckout]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {error && <Alert severity="error">{error}</Alert>}
      <Card sx={{ my: 3, p: 3 }}>
        <Typography variant="h3">Get a quotation for your stay</Typography>
        <Typography sx={{ mb: 3 }}>
          This Information will be strictly used by the hotel and win.so to confirm the
          booking issue the invoice.
        </Typography>
        <Box
          sx={{
            display: 'grid',
            columnGap: 2,
            rowGap: 3,
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }
          }}
        >
          <RHFTextField name="firstname" label="First Name *" />
          <RHFTextField name="lastname" label="Last Name *" />
          <RHFPhoneField name="phone" label="Phone Number *" />
          <RHFTextField name="email" label="Email Address *" />
          <RHFTextField name="companyName" label="Company Name" />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 1
            }}
          >
            <RHFAutocomplete
              name="country"
              label="Country (Optional)"
              options={countriesOptions}
            />
            <RHFTextField name="city" label="City (Optional)" />
          </Box>
          <RHFTextField name="streetName" label="Street name and number (Optional)" />
          <RHFTextField
            name="vat"
            label="VAT Number (optional)"
            InputProps={{
              // Show green checkmark if VAT is valid only
              endAdornment: vatValid ? (
                <Iconify
                  color="green"
                  icon="akar-icons:circle-check-fill"
                  marginLeft={1}
                />
              ) : null
            }}
          />
          <RHFCheckbox
            sx={{
              pl: 2
            }}
            name="invoiceRequired"
            label={<Typography variant="subtitle1">I will need an invoice</Typography>}
          />

          <FormControlLabel
            sx={{
              alignItems: 'flex-start',
              pl: 2
            }}
            control={<Checkbox checked={privacy} onChange={() => setPrivacy(!privacy)} />}
            label={
              <Box>
                <Typography variant="subtitle1">
                  I agree with terms and conditions
                </Typography>
                <Typography>
                  I have read and approved win.so&nbsp;
                  <Link href="/terms" underline="hover" target="_blank" rel="noopener">
                    General Terms & Conditions
                  </Link>
                  &nbsp;for travelers and&nbsp;
                  <Link href="/privacy" underline="hover" target="_blank" rel="noopener">
                    Privacy and Cookie Statement
                  </Link>
                  .
                </Typography>
              </Box>
            }
          />
        </Box>
        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton
            disableElevation
            disabled={!privacy}
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Proceed to Pay the Deposit
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
};
