import { Alert, Box, LinearProgress } from '@mui/material';
import { forwardRef, useEffect, useMemo } from 'react';
import { FacilityOffersSelectMultiple } from './FacilityOffersSelectMultiple';
import { getGroupMode } from 'src/utils/accommodationHookHelper';
import { FacilityOffersSelectOne } from './FacilityOffersSelectOne';
import { FacilitySearchInputs } from './FacilitySearchInputs';
import { useFormContext } from 'react-hook-form';
import { FacilityOffersTitle } from './FacilityOffersTitle';
import { useAccommodationSingle } from 'src/hooks/useAccommodationSingle';
import { useParams } from 'react-router-dom';
import { convertToLocalTime, getIsInPast } from 'src/utils/date';
import { getValidationErrorMessage } from 'src/containers/search/helpers';

export const FacilityOffers = forwardRef<HTMLDivElement>((_, ref) => {
  const { id } = useParams();
  const {
    watch,
    formState: { errors }
  } = useFormContext();
  const { roomCount, adultCount, dateRange } = watch();

  const arrival = useMemo(
    () => dateRange[0].startDate && convertToLocalTime(dateRange[0].startDate),
    [dateRange]
  );
  const departure = useMemo(
    () => dateRange[0].endDate && convertToLocalTime(dateRange[0].endDate),
    [dateRange]
  );

  const searchProps = {
    arrival,
    departure,
    roomCount: Number(roomCount),
    adultCount: Number(adultCount)
  };
  const { accommodationQuery, offersQuery } = useAccommodationSingle({
    id,
    searchProps
  });

  const latestQueryParams = offersQuery.data.latestQueryParams;
  const isGroupMode = getGroupMode(latestQueryParams?.roomCount || roomCount);

  const {
    error,
    isLoading,
    isFetching,
    isFetched,
    refetch,
    data: offersData
  } = offersQuery;
  const accommodation = accommodationQuery?.data?.accommodation;

  // Fetch offers on the initial render after the accommodation info  are being retrieved
  useEffect(() => {
    // Don't query on the initial render if an initial fetch already has been done and a users goes back to this page.
    if (offersData.latestQueryParams) return;

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

    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validationErrorMessage = getValidationErrorMessage(errors);
  const errorMessage = validationErrorMessage || error?.message;
  const showOffers = !error && !isLoading;
  const showError = !isFetching && (validationErrorMessage || error);

  return (
    <Box mb={2.5} ref={ref}>
      <FacilityOffersTitle />

      <FacilitySearchInputs id={id} searchProps={searchProps} />
      {showError && (
        <Alert sx={{ maxWidth: { md: 600 }, mb: 2 }} severity="error">
          {errorMessage}
        </Alert>
      )}

      {!isFetched && isFetching && <LinearProgress sx={{ mt: 2, display: 'block' }} />}
      {isGroupMode && showOffers && (
        <FacilityOffersSelectMultiple
          offers={offersData?.offers}
          initialRoomCount={roomCount}
          arrival={arrival}
          departure={departure}
          adultCount={adultCount}
        />
      )}
      {!isGroupMode && showOffers && (
        <FacilityOffersSelectOne
          offers={offersData?.offers}
          accommodation={accommodation}
          arrival={latestQueryParams?.arrival}
          departure={latestQueryParams?.departure}
          adultCount={latestQueryParams?.adultCount}
          roomCount={latestQueryParams?.roomCount}
        />
      )}
    </Box>
  );
});
