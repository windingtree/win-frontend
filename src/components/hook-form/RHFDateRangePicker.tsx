import { useTheme } from '@mui/material';
import { DateRange } from 'react-date-range';
import { Controller, useFormContext } from 'react-hook-form';

export const RHFDateRangePicker = ({ name, minDate }) => {
  const theme = useTheme();
  const primaryColors = theme.palette.primary;
  const { control } = useFormContext();

  //TODO: make the name variable
  //TODO: include minDate
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <DateRange
          minDate={minDate}
          editableDateInputs={true}
          onChange={(newValue) => onChange([newValue.selection])}
          moveRangeOnFirstSelection={false}
          ranges={value}
          rangeColors={[primaryColors.main, primaryColors.lighter, primaryColors.darker]}
        />
      )}
    />
  );
};
