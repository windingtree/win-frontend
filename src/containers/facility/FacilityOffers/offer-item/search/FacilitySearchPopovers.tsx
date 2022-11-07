import { Popover } from '@mui/material';
import { GuestsAndRoomsInputs } from 'src/components/form-sections/GuestsAndRoomsInputs';
import { RHFDateRangePicker } from 'src/components/hook-form/RHFDateRangePicker';

export const FacilitySearchPopovers = ({
  dateRangeAnchorEl,
  guestsAnchorEl,
  setGuestsAnchorEl,
  setDateRangeAnchorEl
}) => {
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
          horizontal: 'left'
        }}
        marginThreshold={0}
      >
        <GuestsAndRoomsInputs />
      </Popover>
    </>
  );
};
