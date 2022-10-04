import { useFormContext, Controller } from 'react-hook-form';
import {
  Box,
  TextField,
  TextFieldProps,
  Autocomplete,
  InputAdornment
} from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { countries, CountryType } from '../../config';

export type PhoneFieldProps = {
  name: string;
} & TextFieldProps;

export type InputChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export type OnChangeCallback = (e: InputChangeEvent) => void;

export const normalizePhone = (phone: string) => phone.replace(/[^\d]+/gi, '');

export const RHFPhoneField = ({ name, ...other }: PhoneFieldProps) => {
  const { control, getValues, setValue } = useFormContext();
  const [country, setCountry] = useState<CountryType | null>(null);

  const onCountryChange = useCallback(
    (_: InputChangeEvent, value: CountryType) => {
      const phone = getValues()[name];
      if (country && phone) {
        setValue(
          name,
          phone.replace(new RegExp(`^[+]*(${normalizePhone(country.phone)})`), '')
        );
      }
      setCountry(value);
    },
    [name, getValues, setValue, country]
  );

  const doSetCountry = (e: InputChangeEvent): InputChangeEvent => {
    const phone = normalizePhone(e.target.value);
    const phoneCountry = countries.filter((c) =>
      phone.startsWith(normalizePhone(c.phone))
    )[0];
    if (phoneCountry) {
      setCountry(phoneCountry);
    }
    e.target.value = `+${phone}`;
    return e;
  };

  const onFieldChange = (e: InputChangeEvent, onChange: OnChangeCallback): void =>
    onChange(doSetCountry(e));

  useEffect(() => {
    if (country === null) {
      const phone = getValues()[name];
      if (phone) {
        doSetCountry({
          target: { value: phone }
        } as InputChangeEvent);
      }
    }
  }, [name, getValues, country]);

  const applyCode = useCallback(
    (phone: string) => {
      phone = phone ? normalizePhone(phone) : '';
      const code = country && normalizePhone(country.phone);
      if (!code && !phone) {
        return '';
      } else if (code && phone && phone.length <= code.length) {
        return `+${code}`;
      }
      return !code || phone.startsWith(code) ? `+${phone}` : `+${code}${phone}`;
    },
    [country]
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <Autocomplete
            sx={{ width: 300, mr: 1 }}
            autoHighlight
            // disableClearable
            clearIcon={null}
            options={countries}
            value={country}
            onChange={onCountryChange}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => (
              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                <img
                  loading="lazy"
                  width="20"
                  src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                  srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                  alt={option.code}
                />
                {option.label} ({option.code}) +{option.phone}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Country"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: country && (
                    <InputAdornment position="start">
                      <img
                        loading="lazy"
                        width="20"
                        src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png 2x`}
                        alt={country.code}
                      />
                    </InputAdornment>
                  )
                }}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password' // disable autocomplete and autofill
                }}
              />
            )}
          />
          <TextField
            {...field}
            fullWidth
            value={applyCode(field.value)}
            error={!!error}
            helperText={error?.message}
            onChange={(e) => onFieldChange(e, field.onChange)}
            {...other}
          />
        </Box>
      )}
    />
  );
};
