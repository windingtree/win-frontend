import { useTheme } from '@mui/material';
import { DateRange } from 'react-date-range';
import { Controller, useFormContext } from 'react-hook-form';

type RHFDateRangePickerProps = {
  name: string;
  minDate?: Date;
};
export const RHFDateRangePicker = ({ name, minDate }: RHFDateRangePickerProps) => {
  const theme = useTheme();
  const primaryColors = theme.palette.primary;
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
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
