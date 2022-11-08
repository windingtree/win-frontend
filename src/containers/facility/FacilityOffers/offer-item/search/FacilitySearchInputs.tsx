import { Button, Popover } from '@mui/material';
import { Stack } from '@mui/system';
import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { DateRangeButton } from 'src/components/buttons/DateRangeButton';
import { GuestDetailsButton } from 'src/components/buttons/GuestDetailsButton';
import { GuestsAndRoomsInputs } from 'src/components/form-sections/GuestsAndRoomsInputs';
import { RHFDateRangePicker } from 'src/components/hook-form/RHFDateRangePicker';
import { SearchPropsType, useAccommodation } from 'src/hooks/useAccommodation';
import { convertToLocalTime } from 'src/utils/date';

export const FacilitySearchInputs = () => {
  const { id } = useParams();
  const { watch } = useFormContext();
  const { roomCount, adultCount, dateRange } = watch();
  const [searchProps, setSearchProps] = useState<SearchPropsType | undefined>();
  const { accommodationQuery, offersQuery } = useAccommodation({ id, searchProps });
  const { refetch } = offersQuery;
  const { data } = accommodationQuery;

  const arrival = useMemo(
    () => dateRange[0].startDate && convertToLocalTime(dateRange[0].startDate),
    [dateRange]
  );
  const departure = useMemo(
    () => dateRange[0].endDate && convertToLocalTime(dateRange[0].endDate),
    [dateRange]
  );

  /**
   * Set the state which is eventually being send to the BE to retrieve offers of an accommodation.
   */
  useEffect(() => {
    const location = data?.accommodation?.location.coordinates;

    // TODO: location can eventually be removed as the BE will support is searching without the location
    if (!location) return;
    setSearchProps({
      location: { lat: location[0], lon: location[1] },
      arrival,
      departure,
      roomCount: Number(roomCount),
      adultCount: Number(adultCount)
    });
  }, [
    arrival,
    setSearchProps,
    data?.accommodation?.location.coordinates,
    departure,
    roomCount,
    adultCount
  ]);

  const [dateRangeAnchorEl, setDateRangeAnchorEl] = useState<HTMLButtonElement | null>(
    null
  );
  const [guestsAnchorEl, setGuestsAnchorEl] = useState<HTMLButtonElement | null>(null);
  const guestsRef = useRef<HTMLButtonElement>(null);
  const dateRef = useRef<HTMLButtonElement>(null);

  const onSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    refetch();
  };

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
      <Button
        type="submit"
        size="large"
        variant="contained"
        sx={{ px: 6 }}
        onClick={onSubmit}
      >
        Search
      </Button>
    </Stack>
  );
};
