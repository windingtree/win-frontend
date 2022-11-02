import { useTheme } from '@mui/material';
import { DateRange } from 'react-date-range';
import { Controller, useFormContext } from 'react-hook-form';

export type DateRangeType = {
  startDate: Date | null;
  endDate: Date | null;
  key: string;
};

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
          startDatePlaceholder="Check-In"
          endDatePlaceholder="Check-Out"
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
