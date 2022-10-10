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
  styled,
  SxProps,
  IconButton,
  Typography,
  Grid
} from '@mui/material';
import { FormProvider } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Iconify from 'src/components/Iconify';
import {
  autocompleteData,
  endDateDisplay,
  getValidationErrorMessage,
  startDateDisplay
} from './helpers';
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
const SearchIcon = () => <Iconify icon={'akar-icons:search'} width={24} height={24} />;
const FilterIcon = () => <Iconify icon={'mi:filter'} width={30} height={30} />;

export const SearchForm: React.FC<{ closed?: boolean }> = ({ closed }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { pathname, search } = useLocation();

  const [open, setOpen] = useState<boolean>(!closed);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // monitor error state locally
  // generic error message
  const [showError, setShowError] = useState<Error | null>(null);

  // error when no accommodation found
  const [showAccommodationsError, setShowAccommodationsError] = useState<boolean>(false);

  /**
   * Logic in relation to the popovers.
   */
  const formRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLButtonElement>(null);
  const guestsRef = useRef<HTMLButtonElement>(null);
  const [dateRangeAnchorEl, setDateRangeAnchorEl] = useState<HTMLButtonElement | null>(
    null
  );
  const [guestsAnchorEl, setGuestsAnchorEl] = useState<HTMLButtonElement | null>(null);
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
    setValue,
    clearErrors
  } = methods;
  const values = watch();

  const validationErrorMessage = getValidationErrorMessage(errors);

  const { roomCount, adultCount, dateRange, location } = values;
  const startDate = dateRange[0].startDate && convertToLocalTime(dateRange[0].startDate);
  const endDate = dateRange[0].endDate && convertToLocalTime(dateRange[0].endDate);

  const searchProps = {
    arrival: startDate,
    departure: endDate,
    adultCount: Number(adultCount),
    location,
    roomCount: Number(roomCount),
    focusedEvent: useMemo(() => searchParams.get('focusedEvent') ?? '', [searchParams])
  };

  /**
   * Logic in relation to executing the query
   */

  const {
    refetch,
    isFetching,
    error,
    isFetched,
    accommodations,
    latestQueryParams,
    isGroupMode
  } = useAccommodationsAndOffers({ searchProps });

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
      setOpen(false);
      return;
    }
  }, [roomCount, adultCount, dateRange, location, refetch]);

  // Prevent error messages from persisting on path change
  // clear errors when path changes
  const clearErrorMessages = useCallback(() => {
    clearErrors();
    setShowError(null);
    setShowAccommodationsError(false);
  }, []);

  // set local error when error object changes
  useEffect(() => {
    setShowError(error);
  }, [error]);

  useEffect(() => {
    setShowAccommodationsError(!(accommodations?.length > 0) ?? false);
  }, [accommodations]);

  // clear error messages on path change
  useEffect(() => {
    clearErrorMessages();
  }, [pathname, search, clearErrorMessages]);

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
  const buttonSize = 'large';

  const popOversState = {
    isGuestsPopoverOpen,
    guestsAnchorEl,
    setGuestsAnchorEl,
    isDatePopoverOpen,
    dateRangeAnchorEl,
    setDateRangeAnchorEl
  };

  const isMobileView = useMediaQuery(theme.breakpoints.down('md'));

  const formButtonStyle: SxProps = isMobileView
    ? {
        '&:hover': {
          backgroundColor: 'transparent'
        },
        '&:focus': {
          border: `1px solid ${theme.palette.primary.main}`
        }
      }
    : {};

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <SearchPopovers {...popOversState} />
      <Box
        sx={
          !open && isMobile && closed
            ? { background: theme.palette.common.white, width: '100%', p: 2 }
            : { display: 'none' }
        }
      >
        <Grid
          container
          py={0.5}
          border={2}
          borderColor={theme.palette.primary.main}
          alignItems="center"
          borderRadius={1}
        >
          <Grid item xs={'auto'}>
            <IconButton onClick={() => setOpen(true)} color="primary" component="label">
              <SearchIcon />
            </IconButton>
          </Grid>
          <Grid item xs>
            <Box>
              <Typography variant="subtitle2">{location}</Typography>
              <Typography variant="caption">
                {startDateDisplay(dateRange)} — {endDateDisplay(dateRange)},{' '}
                {guestDetailsText}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={'auto'} mx={1}>
            <FilterIcon />
          </Grid>
        </Grid>
      </Box>
      <Stack
        sx={!open && isMobile && closed ? { display: 'none' } : {}}
        direction="column"
      >
        <ToolbarStyle ref={formRef}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems="center"
            spacing={1}
            divider={!isMobileView ? <Divider orientation={'vertical'} flexItem /> : null}
          >
            <RHFTAutocomplete
              variant={isMobileView ? 'outlined' : 'standard'}
              placeholder="Where are you going?"
              name="location"
              options={autocompleteData}
              width={isMobileView ? '320px' : '230px'}
              inputProps={{
                style: {
                  ...fontStyling,
                  textAlign: isMobileView ? 'center' : 'left'
                },
                id: 'location-input'
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
            <Box>
              <Button
                onClick={() => setDateRangeAnchorEl(dateRef.current)}
                size={buttonSize}
                variant={isMobileView ? 'outlined' : 'text'}
                sx={{
                  minWidth: isMobileView ? '320px' : '230px',
                  whiteSpace: 'nowrap',
                  ...fontStyling,
                  ...formButtonStyle
                }}
                color="inherit"
                ref={dateRef}
                disableRipple={isMobileView}
              >
                {startDateDisplay(dateRange)} — {endDateDisplay(dateRange)}
              </Button>
            </Box>

            <Box>
              <Button
                sx={{
                  minWidth: isMobileView ? '320px' : '144px',
                  whiteSpace: 'nowrap',
                  ...fontStyling,
                  ...formButtonStyle
                }}
                onClick={() => setGuestsAnchorEl(guestsRef.current)}
                size={buttonSize}
                variant={isMobileView ? 'outlined' : 'text'}
                color="inherit"
                ref={guestsRef}
                disableRipple={isMobileView}
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
                  minWidth: isMobileView ? '320px' : '230px',
                  whiteSpace: 'nowrap',
                  ...fontStyling
                }}
              >
                Search
              </Button>
            </Box>
          </Stack>
        </ToolbarStyle>
      </Stack>
      <Stack>
        {isGroupMode && accommodations.length && (
          // show this message when in group mode and there are accommodations with offers
          <Alert
            sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}
            severity="info"
          >
            You have entered the group booking mode. Please select your favorite hotel and
            number of rooms to get a quotation.
          </Alert>
        )}
        {validationErrorMessage && (
          <Alert
            sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}
            severity="error"
          >
            {validationErrorMessage}
          </Alert>
        )}

        {showError && (
          <Alert
            sx={{
              display: 'flex',
              justifyContent: 'center',
              textAlign: 'center',
              mt: 1
            }}
            severity="error"
          >
            {(showError as Error) && (showError as Error).message
              ? (showError as Error).message
              : 'Something went wrong '}
          </Alert>
        )}
        {!showError && isFetched && showAccommodationsError && (
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
      </Stack>
    </FormProvider>
  );
};
