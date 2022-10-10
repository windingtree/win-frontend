import { useFormContext, Controller } from 'react-hook-form';
import { TextField, TextFieldProps } from '@mui/material';

type IProps = {
  name: string;
  width?: string;
};

type Props = IProps & TextFieldProps;

export default function RHFTextField({ name, width, fullWidth = true, ...other }: Props) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          sx={{
            width
          }}
          {...field}
          fullWidth={width ? false : fullWidth}
          value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
          error={!!error}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  );
}
