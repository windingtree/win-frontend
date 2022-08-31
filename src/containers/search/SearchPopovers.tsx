import { Box, Popover as BasePopover, styled } from '@mui/material';
import { RHFDateRangePicker } from 'src/components/hook-form/RHFDateRangePicker';
import { SelectGuestsAndRooms } from './SelectGuestsAndRooms';

const Popover = styled(BasePopover)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    width: 'auto'
  }
}));

export const SearchPopovers = ({
  isGuestsPopoverOpen,
  guestsAnchorEl,
  setGuestsAnchorEl,
  isDatePopoverOpen,
  dateRangeAnchorEl,
  setDateRangeAnchorEl
}) => {
  return (
    <>
      <Popover
        id="popover-date-range"
        open={isDatePopoverOpen}
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
      >
        <Box sx={{ width: { sx: '100%', md: 'auto' } }}>
          <RHFDateRangePicker name="dateRange" minDate={new Date()} />
        </Box>
      </Popover>

      <Popover
        id="popover-guest-and-rooms"
        open={isGuestsPopoverOpen}
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
      >
        <SelectGuestsAndRooms />
      </Popover>
    </>
  );
};
