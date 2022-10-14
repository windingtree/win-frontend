import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Popover as BasePopover,
  styled,
  SxProps,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { RHFDateRangePicker } from 'src/components/hook-form/RHFDateRangePicker';
import { SearchLocationInput } from './SearchLocationInput';
import { SelectGuestsAndRooms } from './SelectGuestsAndRooms';

const Popover = styled(BasePopover)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    width: 'auto'
  }
}));

const dialogPaperProps: SxProps = {
  sx: {
    position: 'absolute',
    top: '20%'
  }
};

export const SearchPopovers = ({
  isGuestsPopoverOpen,
  guestsAnchorEl,
  setGuestsAnchorEl,
  isDatePopoverOpen,
  dateRangeAnchorEl,
  setDateRangeAnchorEl,
  locationPopoverOpen,
  setLocationPopoverOpen
}) => {
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'));

  const datePicker = (
    <Box sx={{ width: { sx: '100%', md: 'auto' } }}>
      <RHFDateRangePicker name="dateRange" minDate={new Date()} />
    </Box>
  );

  const handleCloseDatePopup = () => setDateRangeAnchorEl(null);
  const handleCloseGuestsPopup = () => setGuestsAnchorEl(null);
  const handleCloseLocationPopup = () => setLocationPopoverOpen(false);

  if (isMobileView) {
    return (
      <>
        <Dialog open={locationPopoverOpen} PaperProps={dialogPaperProps}>
          <DialogContent>
            <Box minHeight={'10vh'}>
              <SearchLocationInput />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseLocationPopup} variant={'contained'}>
              Done
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={isDatePopoverOpen} PaperProps={dialogPaperProps}>
          <DialogContent>{datePicker}</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDatePopup} variant={'contained'}>
              Done
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={isGuestsPopoverOpen} PaperProps={dialogPaperProps}>
          <DialogContent>
            <SelectGuestsAndRooms />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseGuestsPopup} variant={'contained'}>
              Done
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  } else {
    return (
      <>
        <Popover
          id="popover-date-range"
          open={isDatePopoverOpen}
          anchorEl={dateRangeAnchorEl}
          onClose={handleCloseDatePopup}
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
          {datePicker}
        </Popover>

        <Popover
          id="popover-guest-and-rooms"
          open={isGuestsPopoverOpen}
          anchorEl={guestsAnchorEl}
          onClose={handleCloseGuestsPopup}
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
          <SelectGuestsAndRooms />
        </Popover>
      </>
    );
  }
};
