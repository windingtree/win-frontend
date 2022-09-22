import { Box } from '@mui/material';
import { createRef, useCallback, useEffect, useMemo } from 'react';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';
import { SearchCard } from './SearchCard';
import { useAppState, useAppDispatch } from '../store';
import { styled } from '@mui/system';
import { daysBetween } from '../utils/date';
import { HEADER } from 'src/config/componentSizes';
import { useSearchParams } from 'react-router-dom';
import { accommodationEventTransform } from '../hooks/useAccommodationsAndOffers.tsx/helpers';

const StyledContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  zIndex: '1',
  width: '100%',
  height: '45%',
  top: '55%',
  left: 0,
  padding: theme.spacing(2),
  backgroundColor: '#fff',
  overflow: 'scroll',

  [theme.breakpoints.up('md')]: {
    top: 110 + HEADER.MAIN_DESKTOP_HEIGHT,
    width: '20rem',
    padding: theme.spacing(0, 2),
    height: '70%',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },

  [theme.breakpoints.up('xl')]: {
    top: 0,
    padding: theme.spacing(1, 2),
    paddingTop: 16 + HEADER.MAIN_DESKTOP_HEIGHT,
    height: '100%'
  }
}));

export const Results: React.FC = () => {
  // to highlight a given event marker use url params "focusedEvent"
  const [searchParams] = useSearchParams();
  const focusedEvent = useMemo(
    () => searchParams.get('focusedEvent') ?? '',
    [searchParams]
  );

  // apply a callback function to transform returned accommodation objects
  const transformFn = useCallback(accommodationEventTransform(focusedEvent), [
    focusedEvent
  ]);
  const { accommodations, isFetching, latestQueryParams } = useAccommodationsAndOffers({
    accommodationTransformFn: transformFn
  });

  const { selectedFacilityId } = useAppState();
  const dispatch = useAppDispatch();
  const numberOfDays = useMemo(
    () => daysBetween(latestQueryParams?.arrival, latestQueryParams?.departure),
    [latestQueryParams]
  );

  const handleFacilitySelection = useCallback(
    (facilityId: string) => {
      dispatch({
        type: 'SET_SELECTED_FACILITY_ID',
        payload: facilityId
      });
    },
    [dispatch]
  );

  const SearchCardsRefs = useMemo(
    () =>
      accommodations?.reduce((refs, facility) => {
        const ref = createRef<HTMLDivElement>();
        return { ...refs, [facility.id]: ref };
      }, {}),
    [accommodations]
  );

  // scroll to SearchCard
  useEffect(() => {
    SearchCardsRefs &&
      selectedFacilityId &&
      SearchCardsRefs[selectedFacilityId]?.current?.scrollIntoView();
  }, [selectedFacilityId, SearchCardsRefs]);

  if (!accommodations || accommodations.length === 0) {
    return null;
  }

  return (
    <StyledContainer className="noScrollBar">
      {!isFetching &&
        accommodations.map((facility, idx) => (
          <SearchCard
            key={facility.id}
            facility={facility}
            numberOfDays={numberOfDays}
            isSelected={facility.id === selectedFacilityId}
            onSelect={handleFacilitySelection}
            ref={SearchCardsRefs[idx]}
            focusedEvent={facility.eventInfo}
          />
        ))}
    </StyledContainer>
  );
};
