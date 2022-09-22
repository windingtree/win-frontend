import { yupResolver } from '@hookform/resolvers/yup';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';
import {
  Box,
  Button,
  InputAdornment,
  Stack,
  useTheme,
  Toolbar,
  Divider,
  useMediaQuery,
  Alert,
  styled
} from '@mui/material';
import { FormProvider } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Iconify from 'src/components/Iconify';
import { autocompleteData, endDateDisplay, startDateDisplay } from './helpers';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
  useLocation
} from 'react-router-dom';
import { formatISO, parseISO } from 'date-fns';
import { SearchSchema } from './SearchScheme';
import { convertToLocalTime } from 'src/utils/date';
import RHFTAutocomplete from 'src/components/hook-form/RHFAutocomplete';
import { SearchPopovers } from './SearchPopovers';

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  zIndex: 2,
  paddingBottom: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
  border: 'none',
  width: '100%',
  backgroundColor: theme.palette.background.default,

  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(2),
    width: 'max-content',
    border: `3px solid ${theme.palette.primary.main}`,
    borderRadius: 10
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

const LocationIcon = () => <Iconify icon={'eva:pin-outline'} width={12} height={12} />;

export const SearchForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { pathname, search } = useLocation();

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
    formState: { errors },
    setValue
  } = methods;
  const values = watch();

  const hasLocationValidationError = errors && errors.location ? true : false;
  const hasDateRangeValidationError = errors && errors.dateRange ? true : false;
  const hasAdultCountValidationError = errors && errors.adultCount ? true : false;
  const hasRoomCountValidationError = errors && errors.roomCount ? true : false;

  const { roomCount, adultCount, dateRange, location } = values;
  const startDate = dateRange[0].startDate && convertToLocalTime(dateRange[0].startDate);
  const endDate = dateRange[0].endDate && convertToLocalTime(dateRange[0].endDate);

  const searchProps = {
    arrival: startDate,
    departure: endDate,
    adultCount: Number(adultCount),
    location,
    roomCount: Number(roomCount)
  };

  /**
   * Logic in relation to executing the query
   */

  const { refetch, isFetching, error, isFetched, accommodations, latestQueryParams } =
    useAccommodationsAndOffers({ searchProps });

  const onSubmit = useCallback(() => {
    //TODO: update search params when submitting the form
    if (dateRange[0].startDate !== null && dateRange[0].endDate !== null) {
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
      return;
    }
  }, [roomCount, adultCount, dateRange, location, refetch]);

  /**
   * Conduct a search on the initial render when conditions are met.
   */
  useEffect(() => {
    if (pathname !== '/search') return;

    const includesAllSearchParams =
      !!searchParams.get('location') &&
      !!searchParams.get('endDate') &&
      !!searchParams.get('startDate') &&
      !!searchParams.get('roomCount') &&
      !!searchParams.get('roomCount') &&
      !!searchParams.get('adultCount');

    if (includesAllSearchParams) {
      refetch();
    }
  }, [search]);

  useEffect(() => {
    if (pathname !== '/search' && pathname !== '/') return;

    const includesAllSearchParams =
      !!searchParams.get('location') &&
      !!searchParams.get('endDate') &&
      !!searchParams.get('startDate') &&
      !!searchParams.get('roomCount') &&
      !!searchParams.get('roomCount') &&
      !!searchParams.get('adultCount');

    if (!includesAllSearchParams && latestQueryParams) {
      setValue('location', latestQueryParams.location);
      setValue('adultCount', latestQueryParams.adultCount);
      setValue('roomCount', latestQueryParams.roomCount);
      setValue('dateRange', [
        {
          startDate: latestQueryParams.arrival ?? null,
          endDate: latestQueryParams.departure ?? null,
          key: 'selection'
        }
      ]);
    }
  }, [latestQueryParams, pathname]);
  /**
   * Logic in relation to styling and textual UI
   */
  const roomText = roomCount === 1 ? 'room' : 'rooms';
  const guestDetailsText = `${adultCount} guests, ${roomCount} ${roomText}`;
  const fontStyling = theme.typography.body2;
  const buttonSize = useMediaQuery(theme.breakpoints.down('md')) ? 'small' : 'large';

  const popOversState = {
    isGuestsPopoverOpen,
    guestsAnchorEl,
    setGuestsAnchorEl,
    isDatePopoverOpen,
    dateRangeAnchorEl,
    setDateRangeAnchorEl
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <SearchPopovers {...popOversState} />
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
            <RHFTAutocomplete
              variant="standard"
              placeholder="Where are you going?"
              name="location"
              options={autocompleteData}
              width="230px"
              inputProps={{
                style: {
                  ...fontStyling,
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
                size={buttonSize}
                variant="text"
                sx={{
                  minWidth: '230px',
                  whiteSpace: 'nowrap',
                  ...fontStyling
                }}
                color="inherit"
              >
                {startDateDisplay(dateRange)} — {endDateDisplay(dateRange)}
              </Button>
            </Box>

            <Box>
              <Button
                sx={{
                  minWidth: '144px',
                  whiteSpace: 'nowrap',
                  ...fontStyling
                }}
                onClick={() => setGuestsAnchorEl(formRef.current)}
                size={buttonSize}
                variant="text"
                color="inherit"
              >
                {guestDetailsText}
              </Button>
            </Box>
            <Box>
              <Button
                disableElevation
                type="submit"
                disabled={isFetching}
                variant="contained"
                size={buttonSize}
                sx={{
                  whiteSpace: 'nowrap',
                  ...fontStyling
                }}
              >
                Search
              </Button>
            </Box>
          </Stack>
        </ToolbarStyle>
        <>
          {hasLocationValidationError && (
            <Alert
              sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}
              severity="error"
            >
              Fill in a proper destination.
            </Alert>
          )}
          {hasDateRangeValidationError && (
            <Alert
              sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}
              severity="error"
            >
              Fill in proper dates.
            </Alert>
          )}
          {hasAdultCountValidationError && (
            <Alert
              sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}
              severity="error"
            >
              Fill in proper number of guests.
            </Alert>
          )}
          {hasRoomCountValidationError && (
            <Alert
              sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}
              severity="error"
            >
              Fill in proper number of rooms.
            </Alert>
          )}

          {error && (
            <Alert
              sx={{
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center',
                mt: 1
              }}
              severity="error"
            >
              {(error as Error) && (error as Error).message
                ? (error as Error).message
                : 'Something went wrong '}
            </Alert>
          )}
          {!error && isFetched && accommodations.length === 0 && (
            <Alert
              sx={{
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center',
                mt: 1
              }}
              severity="error"
            >
              {/* use query params value instead of form value, to show only actually searched value */}
              No accommodations found for {latestQueryParams?.location}.
            </Alert>
          )}
        </>
      </Stack>
    </FormProvider>
  );
};
