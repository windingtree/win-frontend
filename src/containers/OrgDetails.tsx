import * as Yup from 'yup';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Card, Link, Stack, Typography } from '@mui/material';
import {
  FormProvider,
  RHFTextField,
  RHFPhoneField,
  RHFAutocomplete,
  RHFCheckbox
} from '../components/hook-form';
import Iconify from '../components/Iconify';
import { regexp } from '@windingtree/org.id-utils';
import { countries } from '../config';
import { isVatValid } from '../utils/vat';
import { useCheckout } from 'src/hooks/useCheckout';
import { OrganizerInformation } from '@windingtree/glider-types/dist/win';
import Logger from '../utils/logger';
import { debouncedFn } from '../utils/common';

const countriesOptions = countries.map((c) => c.label);
const euRegExp = /^(?<CODE>[a-zA-Z]{2})(?<NUM>[a-zA-Z0-9]{5,})$/i;

export interface EuRegExp extends Array<string> {
  groups: {
    CODE?: string;
    NUM?: string;
  };
}

export interface OrganizerInformationForm {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  companyName?: string;
  countryCode: string;
  postalCode?: string;
  cityName: string;
  street: string;
  vatNumber?: string;
  invoice: boolean;
  privacy: boolean;
}

const getFormattedOrganizerInfo = (
  values: OrganizerInformationForm
): OrganizerInformation => {
  const {
    firstName,
    lastName,
    phoneNumber,
    emailAddress,
    companyName,
    vatNumber,
    countryCode,
    postalCode,
    cityName,
    street
  } = values;
  const billingAddress = { countryCode, postalCode, cityName, street };
  const corporateInfo = { companyName, vatNumber, billingAddress };
  const organizerInfo = {
    firstName,
    lastName,
    phoneNumber,
    emailAddress,
    corporateInfo
  };

  return organizerInfo;
};

const defaultValues: OrganizerInformationForm = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  emailAddress: '',
  companyName: '',
  countryCode: '',
  postalCode: '',
  cityName: '',
  street: '',
  vatNumber: '',
  invoice: false,
  privacy: false
};

export const OrgDetails = () => {
  const navigate = useNavigate();
  const [vatValid, setVatValid] = useState<boolean>(false);
  const { setOrganizerInfo, organizerInfo, setBookingInfo, bookGroup } = useCheckout();

  const { corporateInfo, ...restOrganizerInfo } = organizerInfo || {};
  const { billingAddress, ...restCorporateInfo } = corporateInfo || {};
  const defaultValuesSessionStorage = {
    ...defaultValues,
    ...restOrganizerInfo,
    ...restCorporateInfo,
    ...billingAddress
  };

  const organizerSchema = Yup.object().shape({
    firstName: Yup.string()
      .trim()
      .matches(/^[a-z ,.'-]+$/i, 'Only a-z, A-Z chars')
      .required('First name is required'),
    lastName: Yup.string()
      .trim()
      .matches(/^[a-z ,.'-]+$/i, 'Only a-z, A-Z chars')
      .required('Last name is required'),
    phoneNumber: Yup.string()
      .trim()
      .matches(/^\+[1-9]\d{1,14}$/, 'Incorrect phone number')
      .required('Phone number is required'),
    emailAddress: Yup.string()
      .trim()
      .required('Email is required')
      .matches(regexp.email, 'Incorrect email')
      .email(),
    companyName: Yup.string().trim(),
    postalCode: Yup.string().trim(),
    countryCode: Yup.string()
      .trim()
      .test(
        'is-allowed-country',
        'Unknown country name',
        (value) =>
          value !== undefined && (value === '' || countriesOptions.includes(value))
      ),
    cityName: Yup.string().trim(),
    street: Yup.string().trim(),
    vatNumber: Yup.string()
      .trim()
      .test('is-vat-valid', 'VAT number is not valid', async (value) => {
        if (value && value.trim().length >= 7) {
          const vatParsed = euRegExp.exec(value.trim()) as EuRegExp | null;
          if (vatParsed?.groups.CODE && vatParsed?.groups.NUM) {
            try {
              const isValid = await isVatValid(
                vatParsed.groups.CODE,
                vatParsed.groups.NUM
              );
              setVatValid(isValid);
            } catch (error) {
              Logger('OrgDetails-VAT-validation').error((error as Error).message);
            }
            return true;
          }
        }
        return true;
      })
  });
  const methods = useForm<OrganizerInformationForm>({
    resolver: yupResolver(organizerSchema),
    defaultValues: defaultValuesSessionStorage || defaultValues
  });
  const { watch, handleSubmit, trigger } = methods;
  const { privacy, vatNumber } = watch();

  const vatValidation = useCallback(
    debouncedFn(() => trigger('vatNumber'), 1500),
    [debouncedFn, trigger]
  );

  useEffect(() => {
    setVatValid(false);
    const cancelDebounce = vatValidation();

    return cancelDebounce;
  }, [vatValidation, vatNumber]);

  /**
   * In this useEffect data is being stored in the session storage state,
   * while a user is updating the form.
   */
  useEffect(() => {
    const subscription = watch((values) => {
      const { privacy: _, ...rest } = values;

      //TODO: Somehow the RHF package returns types that can be undefined, find a way to prevent that.
      const formattedOrganizerInfo = getFormattedOrganizerInfo(
        rest as OrganizerInformationForm
      );
      const { invoice } = rest;
      setOrganizerInfo(formattedOrganizerInfo);
      setBookingInfo({ invoice });
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async () => {
    try {
      const { serviceId } = await bookGroup.mutateAsync();
      navigate(`/checkout/${serviceId}`);
    } catch (_) {
      return;
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ my: 3, p: 3 }}>
        <Typography variant="h3">Get a quotation for your stay</Typography>
        <Typography sx={{ mb: 3 }}>
          This information will be strictly used by the hotel and win.so to confirm your
          booking.
        </Typography>
        <Stack spacing={3}>
          <RHFTextField name="firstName" label="First Name*" />
          <RHFTextField name="lastName" label="Last Name*" />
          <RHFPhoneField name="phoneNumber" label="Phone Number*" />
          <RHFTextField name="emailAddress" label="Email Address*" />
          <RHFCheckbox
            name="invoice"
            label={<Typography variant="subtitle1">I will need an invoice</Typography>}
          />
          {invoice && (
            <>
              <RHFTextField name="companyName" label="Company Name (Optional)" />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 1
                }}
              >
                <RHFAutocomplete
                  name="countryCode"
                  label="Country (Optional)"
                  options={countriesOptions}
                />
                <RHFTextField name="cityName" label="City (Optional)" />
              </Box>
              <RHFTextField name="postalCode" label="Postal code (Optional)" />
              <RHFTextField name="street" label="Street name and number (Optional)" />
              <RHFTextField
                name="vatNumber"
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
            </>
          )}

          <RHFCheckbox
            name="privacy"
            label={
              <Box>
                <Typography variant="subtitle1">
                  I agree with terms and conditions
                </Typography>
                <Typography variant="caption">
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
        </Stack>

        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          {bookGroup.error && (
            <Alert sx={{ mb: 2 }} severity="error">
              {bookGroup.error.message}
            </Alert>
          )}
          <LoadingButton
            size="large"
            fullWidth
            disableElevation
            disabled={!privacy}
            type="submit"
            variant="contained"
            loading={bookGroup.isLoading}
          >
            Proceed to Pay the Deposit
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
};
