import { yupResolver } from '@hookform/resolvers/yup';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';
import {
  Box,
  Button,
  InputAdornment,
  Popover,
  Stack,
  useTheme,
  Toolbar,
  Divider,
  useMediaQuery,
  Alert
} from '@mui/material';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import React, { useMemo, useRef, useState } from 'react';
import Iconify from 'src/components/Iconify';
import { styled } from '@mui/system';
import { endDateDisplay, startDateDisplay } from './helpers';
import { RHFDateRangePicker } from 'src/components/hook-form/RHFDateRangePicker';
import { SelectGuestsAndRooms } from './SelectGuestsAndRooms';
import { LoadingButton } from '@mui/lab';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { formatISO, parseISO } from 'date-fns';
import { SearchSchema } from './SearchScheme';

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  width: '100%',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up('md')]: {
    borderRadius: 10,
    width: 'auto',
    padding: 0,
    minWidth: 650
  }
}));

type FormValuesProps = {
  location: string;
  roomCount: number | string;
  adultCount: number | string;
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
    key: string;
  }[];
};

type SearchFormProps = {
  navigateAfterSearch?: boolean;
};

const LocationIcon = () => <Iconify icon={'eva:pin-outline'} width={12} height={12} />;

export const SearchForm: React.FC<SearchFormProps> = ({
  navigateAfterSearch = false
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const theme = useTheme();

  /**
   * Logic in relation to the popovers.
   */
  const formRef = useRef<HTMLDivElement>(null);
  const [dateRangeAnchorEl, setDateRangeAnchorEl] = useState<HTMLDivElement | null>(null);
  const [guestsAnchorEl, setGuestsAnchorEl] = useState<HTMLDivElement | null>(null);
  const isDatePopoverOpen = Boolean(dateRangeAnchorEl);
  const isGuestsPopoverOpen = Boolean(guestsAnchorEl);

  /**
   * Logic in relation to handling the form
   */
  const defaultValues: FormValuesProps = useMemo(() => {
    const startDateParams = searchParams.get('startDate');
    const endDateParams = searchParams.get('endDate');

    return {
      location: searchParams.get('location') || '',
      adultCount: Number(searchParams.get('adultCount')) || 2,
      roomCount: Number(searchParams.get('roomCount')) || 1,
      dateRange: [
        {
          startDate: startDateParams ? parseISO(startDateParams) : null,
          endDate: endDateParams ? parseISO(endDateParams) : null,
          key: 'selection'
        }
      ]
    };
  }, [searchParams]);

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(SearchSchema),
    defaultValues
  });
  const {
    watch,
    handleSubmit,
    formState: { errors }
  } = methods;
  const values = watch();
  const hasValidationErrors = Object.keys(errors).length != 0;
  const { roomCount, adultCount, dateRange, location } = values;

  const { refetch, isFetching, error } = useAccommodationsAndOffers({
    date: [dateRange[0].startDate, dateRange[0].endDate],
    adultCount: Number(adultCount),
    location: location,
    roomCount: Number(roomCount)
  });

  const onSubmit = async () => {
    refetch();

    if (
      navigateAfterSearch &&
      dateRange[0].startDate !== null &&
      dateRange[0].endDate !== null
    ) {
      const params = {
        roomCount: roomCount.toString(),
        adultCount: adultCount.toString(),
        startDate: formatISO(dateRange[0].startDate),
        endDate: formatISO(dateRange[0].endDate),
        location
      };

      navigate({
        pathname: '/search',
        search: `?${createSearchParams(params)}`
      });
    }
  };

  /**
   * Logic in relation to styling and textual UI
   */
  const roomText = roomCount === 1 ? 'room' : 'rooms';
  const guestDetailsText = `${adultCount} guests, ${roomCount} ${roomText}`;
  const fontSize = theme.typography.body2.fontSize;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
        <RHFDateRangePicker name="dateRange" minDate={new Date()} />
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
      <Stack direction="column">
        <ToolbarStyle ref={formRef}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems="center"
            spacing={1}
            divider={
              <Divider
                orientation={
                  useMediaQuery(theme.breakpoints.down('md')) ? 'horizontal' : 'vertical'
                }
                flexItem
              />
            }
          >
            <RHFTextField
              variant="standard"
              placeholder="Where are you going?"
              name="location"
              inputProps={{
                style: {
                  fontSize,
                  textAlign: useMediaQuery(theme.breakpoints.down('md'))
                    ? 'center'
                    : 'left'
                }
              }}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon />
                  </InputAdornment>
                )
              }}
            />
            <Box>
              <Button
                onClick={() => setDateRangeAnchorEl(formRef.current)}
                size="small"
                variant="text"
                sx={{
                  whiteSpace: 'nowrap',
                  ...theme.typography.body2
                }}
                color="inherit"
              >
                {startDateDisplay(dateRange)} — {endDateDisplay(dateRange)}
              </Button>
            </Box>

            <Box>
              <Button
                sx={{
                  whiteSpace: 'nowrap',
                  ...theme.typography.body2
                }}
                onClick={() => setGuestsAnchorEl(formRef.current)}
                size="small"
                variant="text"
                color="inherit"
              >
                {guestDetailsText}
              </Button>
            </Box>
            <Box>
              <LoadingButton
                type="submit"
                loading={isFetching}
                variant="outlined"
                size="small"
                sx={{
                  whiteSpace: 'nowrap',
                  ...theme.typography.body2
                }}
              >
                Search
              </LoadingButton>
            </Box>
          </Stack>
        </ToolbarStyle>
        <>
          {hasValidationErrors && (
            <Alert
              sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}
              severity="error"
            >
              Fill in your destination, dates and the amount of rooms/guests.
            </Alert>
          )}

          {error && (
            <Alert
              sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}
              severity="error"
            >
              {(error as Error) && (error as Error).message
                ? (error as Error).message
                : 'Something went wrong '}
            </Alert>
          )}
        </>
      </Stack>
    </FormProvider>
  );
};