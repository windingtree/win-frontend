import { useFormContext, Controller } from 'react-hook-form';
import { Checkbox, FormControlLabel, FormControlLabelProps } from '@mui/material';

interface RHFCheckboxProps extends Omit<FormControlLabelProps, 'control'> {
  name: string;
  value: string;
}

export function RHFArrayCheckbox({ name, value, disabled, ...other }: RHFCheckboxProps) {
  const { control } = useFormContext();

  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Checkbox
              disabled={disabled}
              value={value}
              checked={field.value?.some((existingValue) => existingValue === value)}
              onChange={(event, checked) => {
                if (checked) {
                  field.onChange([...(field.value ?? []), event.target.value]);
                } else {
                  field.onChange(
                    field.value?.filter((value) => value !== event.target.value)
                  );
                }
              }}
            />
          )}
        />
      }
      {...other}
    />
  );
}
