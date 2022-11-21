import { yupResolver } from '@hookform/resolvers/yup';
import { useAccommodationMultiple } from 'src/hooks/useAccommodationMultiple';
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
import { SearchLocationInput, SearchLocationInputElement } from './SearchLocationInput';
import { ResponsiveContainer } from '../ResponsiveContainer';
import { SearchAlert } from './SearchAlert';
import { usePriceFilter } from '../../hooks/usePriceFilter';
import { SearchFilterDialog } from './SearchFilterDialog';
import { DateRangeButton } from 'src/components/buttons/DateRangeButton';
import { GuestDetailsButton } from 'src/components/buttons/GuestDetailsButton';
import { DateRangeType } from 'src/components/hook-form/RHFDateRangePicker';

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
  dateRange: DateRangeType[];
};

type FormInputFields = 'location' | 'dateRange' | 'adultCount' | 'roomCount';

const SearchIcon = () => <Iconify icon="akar-icons:search" width={24} height={24} />;
const FilterIcon = () => <Iconify icon="mi:filter" width={30} height={30} />;

export const SearchForm: React.FC<{ closeable?: boolean }> = ({ closeable }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { pathname, search } = useLocation();
  const [open, setOpen] = useState<boolean>(false);
  const [isSearchPage, setIsSearchPage] = useState(false);
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'));
  const isCloseable: boolean = useMemo(
    () => isMobileView && !!closeable,
    [closeable, isMobileView]
  );
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
  const locationRef = useRef<SearchLocationInputElement>(null);
  const filterRef = useRef<HTMLButtonElement>(null);
  const filterIconButtonRef = useRef<HTMLLabelElement>(null);
  const submitRef = useRef<HTMLButtonElement | null>(null);
  const [dateRangeAnchorEl, setDateRangeAnchorEl] = useState<HTMLButtonElement | null>(
    null
  );
  const [filterAnchorEl, setFilterAnchorEl] = useState<
    HTMLButtonElement | HTMLLabelElement | null
  >(null);
  const [guestsAnchorEl, setGuestsAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

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
   * Logic in relation to executx ing the query
   */
  const {
    refetch,
    isFetching,
    error,
    isFetched,
    latestQueryParams,
    isGroupMode,
    allAccommodations
  } = useAccommodationMultiple({ searchProps });

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
  }, [dateRange, roomCount, adultCount, location, navigate]);

  // Prevent error messages from persisting on path change
  // clear errors when path changes
  const clearErrorMessages = useCallback(() => {
    clearErrors();
    setShowError(null);
    setShowAccommodationsError(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // set local error when error object changes
  useEffect(() => {
    setShowError(error);
  }, [error]);

  useEffect(() => {
    setShowAccommodationsError(!(allAccommodations?.length > 0) ?? false);
  }, [allAccommodations]);

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
  }, [pathname, refetch, search, searchParams]);

  useEffect(() => {
    if (pathname !== '/search' && pathname !== '/') return;

    setIsSearchPage(pathname === '/search');

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
  }, [latestQueryParams, pathname, searchParams, setValue]);

  /**
   * Logic in relation to styling and textual UI
   */
  const roomText = roomCount === 1 ? 'room' : 'rooms';
  const guestDetailsText = `${adultCount} guests, ${roomCount} ${roomText}`;
  const fontStyling = theme.typography.body1;
  const buttonSize = 'large';
  const filterButtonStying: SxProps = {
    backgroundColor: priceFilter.length ? theme.palette.grey[400] : undefined,
    minWidth: isMobileView ? '320px' : '160px'
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
    onLocationPopoverClose: checkFieldToHighlight
  };

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
            <IconButton
              onClick={() => {
                setFilterDialogOpen(true);
              }}
              color="primary"
              component="label"
              ref={filterIconButtonRef}
              disabled={isFetching || !allAccommodations.length}
            >
              <FilterIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
      {/* only show in mobile  */}
      {isMobileView && (
        <Box>
          <SearchFilterDialog open={filterDialogOpen} setOpen={setFilterDialogOpen} />
        </Box>
      )}
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

              <DateRangeButton
                onClick={() => setDateRangeAnchorEl(dateRef.current)}
                startDate={startDate}
                endDate={endDate}
                className={highlightedInput === 'dateRange' ? 'highlighted' : ''}
                ref={dateRef}
                variant={isMobileView ? 'outlined' : 'text'}
              />

              <GuestDetailsButton
                roomCount={roomCount}
                adultCount={adultCount}
                onClick={() => setGuestsAnchorEl(guestsRef.current)}
                variant={isMobileView ? 'outlined' : 'text'}
                ref={guestsRef}
                className={highlightedInput === 'roomCount' ? 'highlighted' : ''}
              />
              <Box>
                <Button
                  disableElevation
                  type="submit"
                  disabled={isFetching}
                  variant="contained"
                  disableRipple={isMobileView}
                  size={buttonSize}
                  sx={{
                    minWidth: isMobileView ? '320px' : '160px',
                    whiteSpace: 'nowrap',
                    ...fontStyling
                  }}
                  ref={(ref) => (submitRef.current = ref)}
                >
                  Search
                </Button>
              </Box>
              {!isMobileView && isSearchPage ? ( // show filter button only on search page and when accommodations are available
                <Box>
                  <Button
                    disableElevation
                    disabled={isFetching || !allAccommodations.length}
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
              ) : null}
            </Stack>
          </ToolbarStyle>
        </FormProvider>
      </ResponsiveContainer>

      <Stack>
        {isGroupMode && allAccommodations.length && (
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
