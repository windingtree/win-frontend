import { LoadingButton } from '@mui/lab';
import { Popover, useTheme } from '@mui/material';
import { Stack } from '@mui/system';
import { formatISO } from 'date-fns';
import { MouseEvent, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { DateRangeButton } from 'src/components/buttons/DateRangeButton';
import { GuestDetailsButton } from 'src/components/buttons/GuestDetailsButton';
import { GuestsAndRoomsInputs } from 'src/components/form-sections/GuestsAndRoomsInputs';
import { RHFDateRangePicker } from 'src/components/hook-form/RHFDateRangePicker';
import {
  SearchPropsType,
  useAccommodationSingle
} from 'src/hooks/useAccommodationSingle';

type FacilitySearchInputsProps = {
  id?: string;
  searchProps?: SearchPropsType;
};

export const FacilitySearchInputs = ({ id, searchProps }: FacilitySearchInputsProps) => {
  const theme = useTheme();
  const { watch, handleSubmit } = useFormContext();
  const { roomCount, adultCount, dateRange } = watch();
  const { offersQuery } = useAccommodationSingle({ id, searchProps });
  const { refetch, isFetching, isFetched } = offersQuery;
  const [_, setSearchParams] = useSearchParams();

  const [dateRangeAnchorEl, setDateRangeAnchorEl] = useState<HTMLButtonElement | null>(
    null
  );
  const [guestsAnchorEl, setGuestsAnchorEl] = useState<HTMLButtonElement | null>(null);
  const guestsRef = useRef<HTMLButtonElement>(null);
  const dateRef = useRef<HTMLButtonElement>(null);

  const onSubmit = (_, event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!searchProps) return;
    refetch();

    const { arrival, departure, roomCount, adultCount } = searchProps;

    setSearchParams({
      arrival: formatISO(arrival),
      departure: formatISO(departure),
      roomCount: roomCount.toString(),
      adultCount: adultCount.toString()
    });
  };

  if (!id) return null;

  return (
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

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          width: { xs: '100%', md: 'auto' },
          border: `solid 2px ${theme.palette.primary.main}`,
          borderRadius: 1,
          mb: 2,
          p: 2,
          display: 'inline-flex'
        }}
        spacing={1}
      >
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
        <LoadingButton
          loading={isFetching}
          type="submit"
          size="large"
          variant="contained"
          sx={{ px: 6 }}
          onClick={handleSubmit(onSubmit)}
        >
          {isFetched ? 'Change Search' : 'Search'}
        </LoadingButton>
      </Stack>
    </>
  );
};
