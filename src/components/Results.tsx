import { Box } from 'grommet';
import { createRef, CSSProperties, useCallback, useEffect, useMemo } from 'react';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';
import { useWindowsDimension } from '../hooks/useWindowsDimension';
import { MessageBox } from './MessageBox';
import { SearchResult } from './SearchResult';
import { useAppState, useAppDispatch } from '../store';

export const Results: React.FC = () => {
  const { accommodations, error, isFetching } = useAccommodationsAndOffers({});
  const { winWidth } = useWindowsDimension();
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

  const resultsContainerStyle: CSSProperties = {
    paddingLeft: 20,
    paddingRight: 20
  };

  if (!accommodations || accommodations.length === 0) {
    return null;
  }

  return (
    <Box
      pad="medium"
      fill={true}
      overflow="hidden"
      style={{
        position: 'absolute',
        zIndex: '1',
        width: winWidth < 900 ? '100%' : '25rem',
        maxWidth: '100%',
        height: winWidth < 900 ? '45%' : '90%',
        left: 20,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0)'
      }}
    >
      <Box flex={true} overflow="auto">
        <Box>
          <MessageBox loading type="info" show={true}>
            One moment...
          </MessageBox>
          <MessageBox
            loading
            type="info"
            show={!isFetching && !error && accommodations?.length === 0}
          >
            Could not find place
          </MessageBox>
          <MessageBox type="error" show={!!error}>
            {/* Make it typesafe:https://tanstack.com/query/v4/docs/typescript */}
            {(error as Error) && 'Something went wrong '}
          </MessageBox>
        </Box>
        <Box gap="0.5rem" flex={false} style={resultsContainerStyle}>
          {/* Currenlty we are displaying accomdations, but this may need to be changed to offers */}
          {accommodations?.map((facility, idx) => (
            <SearchResult
              key={facility.id}
              facility={facility}
              isSelected={facility.id === selectedFacilityId}
              onSelect={handleFacilitySelection}
              ref={searchResultsRefs[idx]}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
