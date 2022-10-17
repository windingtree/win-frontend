import { InputAdornment, SxProps, useMediaQuery, useTheme } from '@mui/material';
import { blue } from '@mui/material/colors';
import { forwardRef, MouseEventHandler } from 'react';
import { RHFAutocomplete } from '../../components/hook-form';
import Iconify from '../../components/Iconify';
import { autocompleteData } from './helpers';

export interface SearchLocationInputProps {
  onClick?: MouseEventHandler;
  highlighted?: boolean;
  highlightedColor?: string;
  allowDropdownOpen?: boolean;
}

export const SearchLocationInput = forwardRef<HTMLInputElement, SearchLocationInputProps>(
  (
    {
      onClick,
      allowDropdownOpen = true,
      highlightedColor = blue[500],
      highlighted = true
    }: SearchLocationInputProps,
    ref?
  ) => {
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('md'));
    const LocationIcon = () => (
      <Iconify icon={'eva:pin-outline'} width={12} height={12} />
    );
    const fontStyling = theme.typography.body2;

    const highlightedStyle: SxProps =
      isMobileView && highlighted
        ? {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: highlightedColor,
              borderWidth: '3px'
            }
          }
        : {};

    return (
      <RHFAutocomplete<string>
        variant={isMobileView ? 'outlined' : 'standard'}
        placeholder="Where are you going?"
        name="location"
        options={autocompleteData}
        width={isMobileView ? '320px' : '230px'}
        open={allowDropdownOpen ? undefined : false}
        inputProps={{
          style: {
            ...fontStyling,
            textAlign: isMobileView ? 'center' : 'left'
          },
          id: 'location-input',
          onClickCapture: onClick
        }}
        InputProps={{
          ...(!isMobileView ? { disableUnderline: true } : {}),
          startAdornment: (
            <InputAdornment position="start">
              <LocationIcon />
            </InputAdornment>
          ),
          sx: highlightedStyle,
          ref: ref
        }}
      />
    );
  }
);
