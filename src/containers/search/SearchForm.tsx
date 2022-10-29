import { yupResolver } from '@hookform/resolvers/yup';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers';
import {
  Box,
  Button,
  Stack,
  useTheme,
  Toolbar,
  Divider,
  useMediaQuery,
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
import { endDateDisplay, getValidationErrorMessage, startDateDisplay } from './helpers';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
  useLocation
} from 'react-router-dom';
import { formatISO, parseISO } from 'date-fns';
import { SearchSchema } from './SearchScheme';
import { convertToLocalTime } from 'src/utils/date';
import { SearchPopovers, SearchPopoversProps } from './SearchPopovers';
import { SearchLocationInput } from './SearchLocationInput';
import { ResponsiveContainer } from '../ResponsiveContainer';
import { SearchAlert } from './SearchAlert';
import { usePriceFilter } from '../../hooks/usePriceFilter';

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  zIndex: 2,
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
  border: 'none',
  backgroundColor: theme.palette.background.default,
  borderRadius: 10,

  [theme.breakpoints.up('md')]: {
    marginTop: theme.spacing(0),
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

type FormInputFields = 'location' | 'dateRange' | 'adultCount' | 'roomCount';

const SearchIcon = () => <Iconify icon="akar-icons:search" width={24} height={24} />;
const FilterIcon = () => <Iconify icon="mi:filter" width={30} height={30} />;
const CalendarIcon = () => <Iconify icon="akar-icons:calendar" width={18} height={18} />;
const PersonIcon = () => <Iconify icon="akar-icons:person" width={18} height={18} />;

export const SearchForm: React.FC<{ closeable?: boolean }> = ({ closeable }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { pathname, search } = useLocation();
  const [open, setOpen] = useState<boolean>(false);
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'));
  const isCloseable: boolean = useMemo(() => isMobileView && !!closeable, [isMobileView]);
  const { priceFilter } = usePriceFilter();

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
  const locationRef = useRef<HTMLInputElement>(null);
  const filterRef = useRef<HTMLButtonElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const [dateRangeAnchorEl, setDateRangeAnchorEl] = useState<HTMLButtonElement | null>(
    null
  );
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [guestsAnchorEl, setGuestsAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);

  // used to highlight inputs in mobile view
  const [highlightedInput, setHighlightedInput] = useState<FormInputFields>();

  const isDatePopoverOpen = Boolean(dateRangeAnchorEl);
  const isGuestsPopoverOpen = Boolean(guestsAnchorEl);
  const isFilterPopoverOpen = Boolean(filterAnchorEl);

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

  // cycle thru all fields to determine which inputs to highlight
  const checkFieldToHighlight = (previousField: FormInputFields, focusNext: boolean) => {
    // prevents highlights in desktop mode
    if (!isMobileView) return;

    // keeps focus on input if dialog was escaped
    if (focusNext === false && previousField) {
      setHighlightedInput(previousField);
      return;
    }

    // if no previous field focus on location
    if (!previousField) {
      setHighlightedInput('location');

      // open input dialog
      locationRef?.current?.click();
    }

    // if previous field is location, focus on date
    else if (previousField === 'location' && focusNext) {
      setHighlightedInput('dateRange');

      // open input dialog
      dateRef?.current?.focus();
      dateRef?.current?.click();
    }
    // if previous field is date, focus on guest count
    else if (previousField === 'dateRange') {
      setHighlightedInput('adultCount');

      // open input dialog
      guestsRef?.current?.focus();
      guestsRef?.current?.click();
    }
    // if previous field is guest count, focus on submit button
    else if (['roomCount', 'adultCount'].includes(previousField)) {
      setHighlightedInput(undefined);

      // wait for dialog to fully close and focus submit button
      setTimeout(() => submitRef?.current?.focus(), 500);
    }
  };

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
  const fontStyling = theme.typography.body1;
  const buttonSize = 'large';
  const filterButtonStying: SxProps = {
    backgroundColor: priceFilter.length ? theme.palette.grey[400] : undefined
  };

  const popOversState: SearchPopoversProps = {
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
    onGuestsPopoverClose: checkFieldToHighlight,
    onDatePopoverClose: checkFieldToHighlight,
    onLocationPopoverClose: checkFieldToHighlight,
    onFilterPopoverClose: checkFieldToHighlight
  };

  const formButtonStyle: SxProps = isMobileView
    ? {
        justifyContent: 'start',
        paddingLeft: theme.spacing(2),
        '&:hover': {
          backgroundColor: 'transparent'
        },
        '&.highlighted': {
          border: `3px solid ${theme.palette.primary.main}`
        }
      }
    : {};

  const handleLocationInputClick = useCallback(() => {
    if (isMobileView) {
      setLocationPopoverOpen(true);
    }
  }, [isMobileView]);

  return (
    <Stack spacing={0.5} sx={{ zIndex: 1 }}>
      <Box
        sx={
          isCloseable
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
            <IconButton onClick={() => setOpen(!open)} color="primary" component="label">
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
            <IconButton disabled color="primary" component="label">
              <FilterIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>

      <ResponsiveContainer
        open={open}
        isCloseable={isCloseable}
        handleClose={() => setOpen(false)}
      >
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <SearchPopovers {...popOversState} />
          <ToolbarStyle ref={formRef}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              alignItems="center"
              spacing={1}
              divider={
                !isMobileView ? <Divider orientation={'vertical'} flexItem /> : null
              }
            >
              <SearchLocationInput
                onClick={handleLocationInputClick}
                allowDropdownOpen={!isMobileView}
                ref={locationRef}
                highlighted={highlightedInput === 'location'}
                highlightedColor={theme.palette.primary.main}
              />
              <Box>
                <Button
                  startIcon={isMobileView && <CalendarIcon />}
                  onClick={() => setDateRangeAnchorEl(dateRef.current)}
                  size={buttonSize}
                  variant={isMobileView ? 'outlined' : 'text'}
                  sx={{
                    minWidth: isMobileView ? '320px' : '200px',
                    whiteSpace: 'nowrap',
                    ...fontStyling,
                    ...formButtonStyle
                  }}
                  className={highlightedInput === 'dateRange' ? 'highlighted' : ''}
                  color="inherit"
                  ref={dateRef}
                  disableRipple={isMobileView}
                >
                  {startDateDisplay(dateRange)} — {endDateDisplay(dateRange)}
                </Button>
              </Box>

              <Box>
                <Button
                  startIcon={isMobileView && <PersonIcon />}
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
                  className={highlightedInput === 'roomCount' ? 'highlighted' : ''}
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
                    minWidth: isMobileView ? '320px' : '160px',
                    whiteSpace: 'nowrap',
                    ...fontStyling
                  }}
                  ref={submitRef}
                >
                  Search
                </Button>
              </Box>
              <Box>
                <Button
                  disableElevation
                  disabled={isFetching}
                  variant="outlined"
                  size={'medium'}
                  sx={{
                    whiteSpace: 'nowrap',
                    ...fontStyling,
                    ...filterButtonStying
                  }}
                  endIcon={<FilterIcon />}
                  ref={filterRef}
                  onClick={() => setFilterAnchorEl(filterRef.current)}
                >
                  Filter
                </Button>
              </Box>
            </Stack>
          </ToolbarStyle>
        </FormProvider>
      </ResponsiveContainer>
      <Stack>
        {isGroupMode && accommodations.length && (
          // show this message when in group mode and there are accommodations with offers
          <SearchAlert severity="info">
            You have entered the group booking mode. <br />
            Please select your favorite hotel and number of rooms to get a quotation.
          </SearchAlert>
        )}
        {validationErrorMessage && <SearchAlert>{validationErrorMessage}</SearchAlert>}

        {showError && (
          <SearchAlert severity="error">
            {(showError as Error) && (showError as Error).message
              ? (showError as Error).message
              : 'Something went wrong '}
          </SearchAlert>
        )}
        {!showError && isFetched && showAccommodationsError && (
          <SearchAlert>
            {/* use query params value instead of form value, to show only actually searched value */}
            No accommodations found for {latestQueryParams?.location}.
          </SearchAlert>
        )}
      </Stack>
    </Stack>
  );
};
