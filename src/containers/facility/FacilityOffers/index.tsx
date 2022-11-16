import { Alert, Box, LinearProgress } from '@mui/material';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { FacilityOffersSelectMultiple } from './FacilityOffersSelectMultiple';
import { getGroupMode } from 'src/hooks/useAccommodationsAndOffers/helpers';
import { FacilityOffersSelectOne } from './FacilityOffersSelectOne';
import { FacilitySearchInputs } from './FacilitySearchInputs';
import { useFormContext } from 'react-hook-form';
import { FacilityOffersTitle } from './FacilityOffersTitle';
import { useAccommodation } from 'src/hooks/useAccommodation';
import { useParams } from 'react-router-dom';
import { convertToLocalTime } from 'src/utils/date';
import { getValidationErrorMessage } from 'src/containers/search/helpers';

export const FacilityOffers = forwardRef<HTMLDivElement>((_, ref) => {
  const { id } = useParams();
  const {
    watch,
    formState: { errors }
  } = useFormContext();
  const { roomCount, adultCount, dateRange } = watch();
  const [isInitialRenderChecked, setIsInitialRenderChecked] = useState<boolean>(false);

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
  const { accommodationQuery, offersQuery } = useAccommodation({
    id,
    searchProps
  });
  const isGroupMode = getGroupMode(
    offersQuery.data.latestQueryParams?.roomCount || roomCount
  );

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

    if (isInitialRenderChecked) return;

    // Don't query on when we are missing variables
    if (!arrival || !departure || !roomCount || !adultCount) {
      return setIsInitialRenderChecked(true);
    }

    // Don't

    refetch();
  }, [
    adultCount,
    arrival,
    departure,
    isInitialRenderChecked,
    offersData.latestQueryParams,
    refetch,
    roomCount
  ]);

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
          arrival={arrival}
          departure={departure}
          adultCount={adultCount}
          roomCount={roomCount}
        />
      )}
    </Box>
  );
});
