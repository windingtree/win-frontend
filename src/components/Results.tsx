import { Box } from '@mui/material';
import { createRef, useCallback, useEffect, useMemo } from 'react';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';
import { SearchResult } from './SearchResult';
import { useAppState, useAppDispatch } from '../store';
import { styled } from '@mui/system';

const StyledContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  zIndex: '1',
  width: '100%',
  height: '45%',
  top: '60%',
  left: 0,
  padding: theme.spacing(2),
  backgroundColor: '#fff',
  overflow: 'scroll',

  [theme.breakpoints.up('md')]: {
    top: 110,
    width: '20rem',
    padding: theme.spacing(0, 2),
    height: '80%',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },

  [theme.breakpoints.up('lg')]: {
    top: 0,
    padding: theme.spacing(2),
    height: '80%'
  }
}));

export const Results: React.FC = () => {
  const { accommodations, isFetching } = useAccommodationsAndOffers();
  const { selectedFacilityId } = useAppState();
  const dispatch = useAppDispatch();

  const handleFacilitySelection = useCallback(
    (facilityId: string) => {
      dispatch({
        type: 'SET_SELECTED_FACILITY_ID',
        payload: facilityId
      });
    },
    [dispatch]
  );

  const searchResultsRefs = useMemo(
    () =>
      accommodations?.reduce((refs, facility) => {
        const ref = createRef<HTMLDivElement>();
        return { ...refs, [facility.id]: ref };
      }, {}),
    [accommodations]
  );

  // scroll to searchResult
  useEffect(() => {
    searchResultsRefs &&
      selectedFacilityId &&
      searchResultsRefs[selectedFacilityId]?.current?.scrollIntoView();
  }, [selectedFacilityId, searchResultsRefs]);

  if (!accommodations || accommodations.length === 0) {
    return null;
  }

  return (
    <StyledContainer className="noScrollBar">
      {!isFetching &&
        accommodations.map((facility, idx) => (
          <SearchResult
            key={facility.id}
            facility={facility}
            isSelected={facility.id === selectedFacilityId}
            onSelect={handleFacilitySelection}
            ref={searchResultsRefs[idx]}
          />
        ))}
    </StyledContainer>
  );
};
