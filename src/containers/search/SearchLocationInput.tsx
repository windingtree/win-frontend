import { InputAdornment, SxProps, useMediaQuery, useTheme } from '@mui/material';
import {
  forwardRef,
  MouseEventHandler,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import { RHFAutocomplete } from '../../components/hook-form';
import Iconify from '../../components/Iconify';
import { emptyFunction } from '../../utils/common';
import { autocompleteData } from './helpers';

export interface SearchLocationInputProps {
  onClick?: MouseEventHandler;
  highlighted?: boolean;
  highlightedColor?: string;
  allowDropdownOpen?: boolean;
  OnEnterKey?: (...args: unknown[]) => void;
}

export type SearchLocationInputElement = {
  openDropdown: () => void;
  closeDropdown: () => void;
  click: () => void;
};

export const SearchLocationInput = forwardRef<
  SearchLocationInputElement,
  SearchLocationInputProps
>(
  (
    {
      onClick,
      allowDropdownOpen = true,
      highlightedColor = 'primary.main',
      highlighted = true,
      OnEnterKey = emptyFunction
    }: SearchLocationInputProps,
    ref?
  ) => {
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('md'));
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const LocationIcon = () => (
      <Iconify icon={'eva:pin-outline'} width={18} height={18} marginLeft={0.5} />
    );

    const highlightedStyle: SxProps =
      isMobileView && highlighted
        ? {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: highlightedColor,
              borderWidth: '3px'
            }
          }
        : {};

    useImperativeHandle(ref, () => ({
      openDropdown: () => setOpen(true),
      closeDropdown: () => setOpen(false),
      click: () => inputRef?.current?.click()
    }));

    return (
      <RHFAutocomplete<string>
        variant={isMobileView ? 'outlined' : 'standard'}
        placeholder="Where are you going?"
        name="location"
        options={autocompleteData}
        width={isMobileView ? '320px' : '230px'}
        open={allowDropdownOpen ? open : false}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputProps={{
          style: {
            textAlign: 'start',
            paddingLeft: theme.spacing(0)
          },
          id: 'location-input',
          onClickCapture: onClick,
          onKeyDown: (e) => {
            e.code === 'Enter' && OnEnterKey();
          }
        }}
        InputProps={{
          ...(!isMobileView ? { disableUnderline: true } : {}),
          startAdornment: (
            <InputAdornment position="start">
              <LocationIcon />
            </InputAdornment>
          ),
          sx: highlightedStyle,
          inputRef
        }}
      />
    );
  }
);
