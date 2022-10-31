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
import { Dispatch, SetStateAction, useRef } from 'react';
import { RHFDateRangePicker } from 'src/components/hook-form/RHFDateRangePicker';
import { emptyFunction } from '../../utils/common';
import { SearchFilterForm } from './SearchFilterForm';
import { SearchLocationInput, SearchLocationInputElement } from './SearchLocationInput';
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

export interface SearchPopoversProps {
  isGuestsPopoverOpen: boolean;
  guestsAnchorEl: HTMLButtonElement | null;
  setGuestsAnchorEl: Dispatch<SetStateAction<HTMLButtonElement | null>>;
  isDatePopoverOpen: boolean;
  dateRangeAnchorEl: HTMLButtonElement | null;
  setDateRangeAnchorEl: Dispatch<SetStateAction<HTMLButtonElement | null>>;
  locationPopoverOpen: boolean;
  setLocationPopoverOpen: Dispatch<SetStateAction<boolean>>;
  isFilterPopoverOpen: boolean;
  filterAnchorEl: HTMLButtonElement | HTMLLabelElement | null;
  setFilterAnchorEl: Dispatch<
    SetStateAction<HTMLButtonElement | HTMLLabelElement | null>
  >;
  onLocationPopoverClose?: (...args: unknown[]) => void;
  onGuestsPopoverClose?: (...args: unknown[]) => void;
  onDatePopoverClose?: (...args: unknown[]) => void;
  onFilterPopoverClose?: (...args: unknown[]) => void;
}

export const SearchPopovers = ({
  isGuestsPopoverOpen,
  guestsAnchorEl,
  setGuestsAnchorEl,
  isDatePopoverOpen,
  dateRangeAnchorEl,
  setDateRangeAnchorEl,
  locationPopoverOpen,
  setLocationPopoverOpen,
  isFilterPopoverOpen,
  filterAnchorEl,
  setFilterAnchorEl,
  onLocationPopoverClose = emptyFunction,
  onGuestsPopoverClose = emptyFunction,
  onDatePopoverClose = emptyFunction
}: SearchPopoversProps) => {
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'));
  const inputRef = useRef<SearchLocationInputElement>(null);

  const datePicker = (
    <Box sx={{ width: { sx: '100%', md: 'auto' } }}>
      <RHFDateRangePicker name="dateRange" minDate={new Date()} />
    </Box>
  );

  const handleCloseDatePopup = (focusNext: boolean | undefined = true) => {
    setDateRangeAnchorEl(null);
    focusNext !== undefined && onDatePopoverClose('dateRange', focusNext);
  };
  const handleCloseGuestsPopup = (focusNext: boolean | undefined = true) => {
    setGuestsAnchorEl(null);
    focusNext !== undefined && onGuestsPopoverClose('roomCount', focusNext);
  };
  const handleCloseLocationPopup = (focusNext: boolean | undefined = true) => {
    setLocationPopoverOpen(false);
    focusNext !== undefined && onLocationPopoverClose('location', focusNext);
  };
  const handleCloseFilterPopup = () => {
    setFilterAnchorEl(null);
  };

  const handleEscape = (_, reason) => {
    reason && locationPopoverOpen
      ? handleCloseLocationPopup(false)
      : guestsAnchorEl
      ? handleCloseGuestsPopup(false)
      : dateRangeAnchorEl
      ? handleCloseDatePopup(false)
      : filterAnchorEl
      ? handleCloseFilterPopup()
      : null;
  };

  if (isMobileView) {
    return (
      <>
        <Dialog
          open={locationPopoverOpen}
          PaperProps={dialogPaperProps}
          onClose={handleEscape}
          TransitionProps={{
            onEntered: () => inputRef?.current?.openDropdown()
          }}
        >
          <DialogContent>
            <Box minHeight={'10vh'}>
              <SearchLocationInput
                ref={inputRef}
                OnEnterKey={() => handleCloseLocationPopup(true)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              onClick={() => handleCloseLocationPopup(true)}
              variant={'contained'}
            >
              Next
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isDatePopoverOpen}
          PaperProps={dialogPaperProps}
          onClose={handleEscape}
        >
          <DialogContent>{datePicker}</DialogContent>
          <DialogActions>
            <Button
              type="submit"
              onClick={() => handleCloseDatePopup(true)}
              variant={'contained'}
            >
              Next
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isGuestsPopoverOpen}
          PaperProps={dialogPaperProps}
          onClose={handleEscape}
        >
          <DialogContent>
            <SelectGuestsAndRooms />
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              onClick={() => handleCloseGuestsPopup(true)}
              variant={'contained'}
            >
              Done
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isFilterPopoverOpen}
          PaperProps={dialogPaperProps}
          onClose={handleEscape}
        >
          <DialogContent>
            <SearchFilterForm
              onCloseClick={() => handleCloseFilterPopup()}
              onSubmitClick={() => handleCloseFilterPopup()}
            />
          </DialogContent>
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
          onClose={() => handleCloseDatePopup()}
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
          onClose={() => handleCloseGuestsPopup()}
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

        <Popover
          id="popover-price-filter"
          open={isFilterPopoverOpen}
          anchorEl={filterAnchorEl}
          onClose={() => handleCloseFilterPopup()}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          marginThreshold={0}
        >
          <SearchFilterForm
            onCloseClick={() => handleCloseFilterPopup()}
            onSubmitClick={() => handleCloseFilterPopup()}
          />
        </Popover>
      </>
    );
  }
};
