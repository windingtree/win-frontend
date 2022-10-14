import { InputAdornment, useMediaQuery, useTheme } from '@mui/material';
import { MouseEventHandler } from 'react';
import { RHFAutocomplete } from '../../components/hook-form';
import Iconify from '../../components/Iconify';
import { autocompleteData } from './helpers';

export interface SearchLocationInputProps {
  onClick?: MouseEventHandler;
  focused?: boolean;
  allowDropdownOpen?: boolean;
}

export const SearchLocationInput = ({
  onClick,
  allowDropdownOpen = true
}: SearchLocationInputProps) => {
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'));
  const LocationIcon = () => <Iconify icon={'eva:pin-outline'} width={12} height={12} />;
  const fontStyling = theme.typography.body2;

  return (
    <RHFAutocomplete
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
        )
      }}
    />
  );
};
