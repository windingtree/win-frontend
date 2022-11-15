import { Alert, Box, LinearProgress } from '@mui/material';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { FacilityOffersSelectMultiple } from './FacilityOffersSelectMultiple';
import { getGroupMode } from 'src/hooks/useAccommodationsAndOffers/helpers';
import { FacilityOffersSelectOne } from './FacilityOffersSelectOne';
import { FacilitySearchInputs } from './FacilitySearchInputs';
import { useFormContext } from 'react-hook-form';
import { FacilityOffersTitle } from './FacilityOffersTitle';
import { SearchPropsType, useAccommodation } from 'src/hooks/useAccommodation';
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
  const isGroupMode = getGroupMode(roomCount);

  const arrival = useMemo(
    () => dateRange[0].startDate && convertToLocalTime(dateRange[0].startDate),
    [dateRange]
  );
  const departure = useMemo(
    () => dateRange[0].endDate && convertToLocalTime(dateRange[0].endDate),
    [dateRange]
  );
  const [searchProps, setSearchProps] = useState<SearchPropsType | undefined>();
  const { accommodationQuery, offersQuery } = useAccommodation({ id, searchProps });
  const { error, isLoading, isFetching, refetch, data: offersData } = offersQuery;
  const accommodation = accommodationQuery?.data?.accommodation;
  const [isOffersFetchedOnce, setIsOffersFetchedOnce] = useState<boolean>(false);

  /**
   * Set the state which is eventually being send to the BE to retrieve offers of an accommodation.
   */
  useEffect(() => {
    const location = accommodation?.location.coordinates;

    // TODO: location can eventually be removed as the BE will support is searching without the location
    if (!location) return;
    setSearchProps({
      location: { lat: location[1], lon: location[0] },
      arrival,
      departure,
      roomCount: Number(roomCount),
      adultCount: Number(adultCount)
    });
  }, [
    arrival,
    setSearchProps,
    departure,
    roomCount,
    adultCount,
    accommodation?.location.coordinates
  ]);

  /**
   * Fetch the offers on the initial render, if we have all the required date from the query params.
   */
  useEffect(() => {
    if (isOffersFetchedOnce || !id || !searchProps) return;
    const { arrival, departure, roomCount, adultCount } = searchProps;

    if (!arrival || !departure || !roomCount || !adultCount) return;

    refetch();
    setIsOffersFetchedOnce(true);
  }, [id, isLoading, isOffersFetchedOnce, refetch, searchProps]);

  const validationErrorMessage = getValidationErrorMessage(errors);
  const errorMessage = validationErrorMessage || error?.message;
  const showOffers = !error && !isLoading;
  const showError = validationErrorMessage || error;

  return (
    <Box mb={2.5} ref={ref}>
      <FacilityOffersTitle />

      <FacilitySearchInputs id={id} searchProps={searchProps} />
      {showError && (
        <Alert sx={{ maxWidth: { md: 600 }, mb: 2 }} severity="error">
          {errorMessage}
        </Alert>
      )}
      {isLoading && <LinearProgress sx={{ mt: 2, display: 'block' }} />}
      {isGroupMode && showOffers && (
        <FacilityOffersSelectMultiple offers={offersData?.offers} />
      )}
      {!isGroupMode && showOffers && (
        <FacilityOffersSelectOne
          offers={offersData?.offers}
          accommodation={accommodation}
        />
      )}
    </Box>
  );
});
