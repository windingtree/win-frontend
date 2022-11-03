import { Button } from '@mui/material';
import { Stack } from '@mui/system';
import { useRef, useState } from 'react';
import { DateRangeButton } from 'src/components/buttons/DateRangeButton';
import { GuestDetailsButton } from 'src/components/buttons/GuestDetailsButton';
import { FacilitySearchPopovers } from './FacilitySearchPopovers';

export const FacilitySearchInputs = () => {
  const guestsRef = useRef<HTMLButtonElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const [dateRangeAnchorEl, setDateRangeAnchorEl] = useState<HTMLButtonElement | null>(
    null
  );
  const [guestsAnchorEl, setGuestsAnchorEl] = useState<HTMLButtonElement | null>(null);

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
      <FacilitySearchPopovers
        guestsAnchorEl={guestsAnchorEl}
        dateRangeAnchorEl={dateRangeAnchorEl}
      />
      <DateRangeButton
        onClick={() => setDateRangeAnchorEl(dateRef.current)}
        ref={dateRef}
      />
      <GuestDetailsButton
        adultCount={1}
        roomCount={1}
        onClick={() => setGuestsAnchorEl(guestsRef.current)}
        ref={guestsRef}
      />
      <Button size="large" variant="contained" sx={{ px: 6 }}>
        Search
      </Button>
    </Stack>
  );
};
