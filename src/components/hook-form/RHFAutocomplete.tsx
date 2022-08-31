import { useFormContext, Controller } from 'react-hook-form';
import { Autocomplete, TextField, TextFieldProps } from '@mui/material';

type IProps = {
  name: string;
  options: string[];
  freeSolo?: boolean;
  width?: string | number;
};

type Props = IProps & TextFieldProps;

export default function RHFTAutocomplete({
  name,
  options,
  freeSolo = true,
  width = '300px',
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          freeSolo={freeSolo}
          isOptionEqualToValue={(option, value) => option === value}
          onChange={(event, newValue) => field.onChange(newValue ?? '')}
          onInputChange={(event, newValue) => field.onChange(newValue ?? '')}
          options={options}
          sx={{ width }}
          renderInput={({ InputProps, inputProps, ...restParams }) => (
            <TextField
              label={other.label}
              error={!!error}
              helperText={error?.message}
              placeholder={other.placeholder}
              variant={other.variant}
              inputProps={{ ...inputProps, ...other.inputProps }}
              InputProps={{ ...InputProps, ...other.InputProps }}
              {...restParams}
            />
          )}
        />
      )}
    />
  );
}
