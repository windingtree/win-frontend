import type { TextFieldProps } from '@mui/material';
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Controller, useFormContext } from 'react-hook-form';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

type IProps = {
  name: string;
};

type Props = IProps & TextFieldProps;

export const RHFDatePicker = ({ name, ...other }: Props) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            openTo="year"
            views={['year', 'month', 'day']}
            label={other.label}
            value={value}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
            inputFormat="DD/MM/YYYY"
            onChange={onChange}
          />
        </LocalizationProvider>
      )}
    />
  );
};
