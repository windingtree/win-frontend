import { Button } from '@mui/material';
import { Stack } from '@mui/system';
import { DateRangeButton } from 'src/components/buttons/DateRangeButton';
import { GuestDetailsButton } from 'src/components/buttons/GuestDetailsButton';

export const FacilitySearchInputs = () => {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
      <DateRangeButton />
      <GuestDetailsButton adultCount={1} roomCount={1} />
      <Button size="large" variant="contained" sx={{ px: 6 }}>
        Search
      </Button>
    </Stack>
  );
};
