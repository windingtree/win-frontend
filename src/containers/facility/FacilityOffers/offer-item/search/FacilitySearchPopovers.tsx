import { Popover } from '@mui/material';
import { GuestAndRoomsInputs } from 'src/components/form-sections/GuestAndRoomsInputs';
import { RHFDateRangePicker } from 'src/components/hook-form/RHFDateRangePicker';

export const FacilitySearchPopovers = ({ dateRangeAnchorEl, guestsAnchorEl }) => {
  return (
    <>
      <Popover
        id="popover-date-range"
        open={Boolean(dateRangeAnchorEl)}
        anchorEl={dateRangeAnchorEl}
        // onClose={() => handleCloseDatePopup()}
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
        // onClose={() => handleCloseGuestsPopup()}
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
        <GuestAndRoomsInputs />
      </Popover>
    </>
  );
};
