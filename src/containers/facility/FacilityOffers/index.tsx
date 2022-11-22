import { Alert, Box, LinearProgress } from '@mui/material';
import { forwardRef, MouseEvent, useEffect, useMemo, useState } from 'react';
import { FacilityOffersSelectMultiple } from './FacilityOffersSelectMultiple';
import { getGroupMode } from 'src/utils/accommodationHookHelper';
import { FacilityOffersSelectOne } from './FacilityOffersSelectOne';
import { FacilitySearchInputs } from './FacilitySearchInputs';
import { useFormContext } from 'react-hook-form';
import { FacilityOffersTitle } from './FacilityOffersTitle';
import {
  SearchPropsType,
  useAccommodationSingle
} from 'src/hooks/useAccommodationSingle';
import { useParams, useSearchParams } from 'react-router-dom';
import { convertToLocalTime, getIsInPast } from 'src/utils/date';
import { getValidationErrorMessage } from 'src/containers/search/helpers';
import { formatISO } from 'date-fns';

type FacilityOffersProps = {
  setSearchProps: (value: SearchPropsType) => void;
  searchProps?: SearchPropsType;
};

export const FacilityOffers = forwardRef<HTMLDivElement, FacilityOffersProps>(
  ({ setSearchProps, searchProps }: FacilityOffersProps, ref) => {
    const { id } = useParams();
    const {
      watch,
      formState: { errors }
    } = useFormContext();
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
      searchProps
    });

    const latestQueryParams = offersQuery.data.latestQueryParams;
    const isGroupMode = getGroupMode(latestQueryParams?.roomCount || roomCount);
    const { error, isFetching, data: offersData } = offersQuery;
    const accommodation = accommodationQuery?.data?.accommodation;

    // Fetch offers on the initial render after the accommodation info  are being retrieved
    useEffect(() => {
      // Don't query on the initial render if an initial fetch already has been done and a users goes back to this page.
      if (offersData?.latestQueryParams) return;

      // Don't query on when we are missing variables or when one of the dates is in the past
      if (
        !arrival ||
        !departure ||
        !roomCount ||
        !adultCount ||
        getIsInPast(arrival) ||
        getIsInPast(departure)
      ) {
        return;
      }

      setSearchProps({
        arrival,
        departure,
        roomCount: Number(roomCount),
        adultCount: Number(adultCount)
      });

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = (_, event: MouseEvent) => {
      event.preventDefault();

      setSearchProps({
        arrival,
        departure,
        roomCount: Number(roomCount),
        adultCount: Number(adultCount)
      });

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
            searchFormProps={{ roomCount, arrival, adultCount, departure }}
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
