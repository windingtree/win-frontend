import { Box, Paper } from '@mui/material';
import { createRef, useCallback, useEffect, useMemo } from 'react';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';
import { SearchResult } from './SearchResult';
import { useAppState, useAppDispatch } from '../store';
import { styled } from '@mui/system';

const StyledContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  zIndex: '1',
  width: '100%',
  height: '40%',
  bottom: 0,
  marginBottom: theme.spacing(1),
  padding: theme.spacing(0, 3),
  backgroundColor: 'rgba(0, 0, 0, 0)',
  overflow: 'scroll',

  [theme.breakpoints.up('md')]: {
    width: '20rem',
    height: '70%'
  },

  [theme.breakpoints.up('lg')]: {
    height: '86%'
  }
}));

export const Results: React.FC = () => {
  const { accommodations } = useAccommodationsAndOffers();
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
    <StyledContainer>
      {accommodations.map((facility, idx) => (
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
