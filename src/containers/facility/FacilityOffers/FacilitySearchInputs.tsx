import { Stack } from '@mui/system';
import { RHFDateRangePicker } from 'src/components/hook-form/RHFDateRangePicker';

export const FacilitySearchInputs = () => {
  return (
    <Stack>
      <RHFDateRangePicker name="dateRange" />
    </Stack>
  );
};
