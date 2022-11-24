import { Alert, Box, LinearProgress } from '@mui/material';
import { forwardRef, MouseEvent, useEffect, useMemo, useState } from 'react';
import { FacilityOffersSelectMultiple } from './FacilityOffersSelectMultiple';
import {
  getGroupMode,
  isOffersSearchPropsValid
} from 'src/utils/accommodationHookHelper';
import { FacilityOffersSelectOne } from './FacilityOffersSelectOne';
import { FacilitySearchInputs } from './FacilitySearchInputs';
import { useFormContext } from 'react-hook-form';
import { FacilityOffersTitle } from './FacilityOffersTitle';
import {
  SearchPropsType,
  useAccommodationSingle
} from 'src/hooks/useAccommodationSingle';
import { useParams, useSearchParams } from 'react-router-dom';
import { convertToLocalTime } from 'src/utils/date';
import { getValidationErrorMessage } from 'src/containers/search/helpers';
import { formatISO } from 'date-fns';

type FacilityOffersProps = {
  setSearchPropsQuery: (value: SearchPropsType) => void;
  searchPropsQuery?: SearchPropsType;
};
import { FacilitySearchFormValuesProps } from './FacilitySearchFormProvider';

export const FacilityOffers = forwardRef<HTMLDivElement, FacilityOffersProps>(
  ({ setSearchPropsQuery, searchPropsQuery }: FacilityOffersProps, ref) => {
    const { id } = useParams();
    const {
      watch,
      formState: { errors }
    } = useFormContext<FacilitySearchFormValuesProps>();
    const { roomCount, adultCount, dateRange } = watch();
    const [_, setSearchParams] = useSearchParams();
    const [haveOffersBeenFetchedOnce, setHaveOffersBeenFetchedOnce] = useState(false);

    const arrival = useMemo(
      () => dateRange[0].startDate && convertToLocalTime(dateRange[0].startDate),
      [dateRange]
    );
    const departure = useMemo(
      () => dateRange[0].endDate && convertToLocalTime(dateRange[0].endDate),
      [dateRange]
    );

    const { accommodationQuery, offersQuery } = useAccommodationSingle({
      id,
      searchProps: searchPropsQuery
    });

    const latestQueryParams = offersQuery.data.latestQueryParams;
    const isGroupMode = getGroupMode(latestQueryParams?.roomCount || roomCount);
    const { error, isFetching, data: offersData } = offersQuery;
    const accommodation = accommodationQuery?.data?.accommodation;

    const searchPropsForm = {
      arrival,
      departure,
      roomCount: Number(roomCount),
      adultCount: Number(adultCount)
    };

    // Fetch offers on the initial render.
    useEffect(() => {
      // Don't query on the initial render if an initial fetch already has been done.
      if (offersData?.latestQueryParams) return;

      // Don't query on when we are missing variables or when one of the dates is in the past
      if (isOffersSearchPropsValid(searchPropsForm)) {
        setSearchPropsQuery(searchPropsForm);
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = (_, event: MouseEvent) => {
      event.preventDefault();

      if (!arrival || !departure) return;

      setSearchPropsQuery(searchPropsForm);

      setSearchParams({
        arrival: formatISO(arrival),
        departure: formatISO(departure),
        roomCount: roomCount.toString(),
        adultCount: adultCount.toString()
      });
    };

    useEffect(() => {
      if (haveOffersBeenFetchedOnce) return;

      if (offersData?.offers) setHaveOffersBeenFetchedOnce(true);
    }, [haveOffersBeenFetchedOnce, offersData]);

    const validationErrorMessage = getValidationErrorMessage(errors);
    const errorMessage = validationErrorMessage || error?.message;
    const showOffers = !error && haveOffersBeenFetchedOnce;
    const showError = !isFetching && (validationErrorMessage || error);

    return (
      <Box mb={2.5} ref={ref}>
        <FacilityOffersTitle />

        <FacilitySearchInputs
          id={id}
          onSubmit={onSubmit}
          haveOffersBeenFetchedOnce={haveOffersBeenFetchedOnce}
          isFetching={isFetching}
        />
        {showError && (
          <Alert sx={{ maxWidth: { md: 600 }, mb: 2 }} severity="error">
            {errorMessage}
          </Alert>
        )}

        {isFetching && !haveOffersBeenFetchedOnce && (
          <LinearProgress sx={{ mt: 2, display: 'block' }} />
        )}
        {isGroupMode && showOffers && (
          <FacilityOffersSelectMultiple
            offers={offersData?.offers}
            searchPropsForm={searchPropsForm}
          />
        )}
        {!isGroupMode && showOffers && (
          <FacilityOffersSelectOne
            offers={offersData?.offers}
            accommodation={accommodation}
            latestQueryParams={latestQueryParams}
          />
        )}
      </Box>
    );
  }
);
