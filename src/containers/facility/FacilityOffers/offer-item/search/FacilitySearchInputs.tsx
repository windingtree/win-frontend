import { Button, Popover } from '@mui/material';
import { Stack } from '@mui/system';
import { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { DateRangeButton } from 'src/components/buttons/DateRangeButton';
import { GuestDetailsButton } from 'src/components/buttons/GuestDetailsButton';
import { GuestsAndRoomsInputs } from 'src/components/form-sections/GuestsAndRoomsInputs';
import { RHFDateRangePicker } from 'src/components/hook-form/RHFDateRangePicker';

export const FacilitySearchInputs = () => {
  const { watch } = useFormContext();
  const { roomCount, adultCount, dateRange } = watch();
  const guestsRef = useRef<HTMLButtonElement>(null);
  const dateRef = useRef<HTMLButtonElement>(null);
  const [dateRangeAnchorEl, setDateRangeAnchorEl] = useState<HTMLButtonElement | null>(
    null
  );
  const [guestsAnchorEl, setGuestsAnchorEl] = useState<HTMLButtonElement | null>(null);

  const PopOvers = () => (
    <>
      <Popover
        id="popover-date-range"
        open={Boolean(dateRangeAnchorEl)}
        anchorEl={dateRangeAnchorEl}
        onClose={() => setDateRangeAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        marginThreshold={0}
      >
        <RHFDateRangePicker name="dateRange" minDate={new Date()} />
      </Popover>

      <Popover
        id="popover-guest-and-rooms"
        open={Boolean(guestsAnchorEl)}
        anchorEl={guestsAnchorEl}
        onClose={() => setGuestsAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        marginThreshold={0}
      >
        <GuestsAndRoomsInputs />
      </Popover>
    </>
  );

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
      <PopOvers />
      <DateRangeButton
        startDate={dateRange[0].startDate}
        endDate={dateRange[0].endDate}
        onClick={() => setDateRangeAnchorEl(dateRef.current)}
        ref={dateRef}
      />
      <GuestDetailsButton
        adultCount={adultCount}
        roomCount={roomCount}
        onClick={() => setGuestsAnchorEl(guestsRef.current)}
        ref={guestsRef}
      />
      <Button size="large" variant="contained" sx={{ px: 6 }}>
        Search
      </Button>
    </Stack>
  );
};
