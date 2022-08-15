import type { LatLngTuple } from 'leaflet';
import { useAppState, useAppDispatch } from '../store';
import { Box } from 'grommet';
import {
  createRef,
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import Logger from '../utils/logger';
import { useWindowsDimension } from '../hooks/useWindowsDimension';
import axios from 'axios';
import { MessageBox } from './MessageBox';
import { OffersRequest, OffersResponse, SearchParamsSchema } from '../api/OffersRequest';
import { object } from '@windingtree/org.id-utils';
import { SearchResult } from './SearchResult';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers';

export const Results: React.FC = () => {
  const { accommodations, error, isFetching } = useAccommodationsAndOffers({});
  const { winWidth } = useWindowsDimension();
  const [selectedFaciltyId, setSelectedFacilityId] = useState<undefined | string>();

  const searchResultsRefs = useMemo(
    () =>
      accommodations?.reduce((refs, facility) => {
        const ref = createRef<HTMLDivElement>();
        return { ...refs, [facility.id]: ref };
      }, {}),
    [accommodations]
  );

  const handleFacilitySelection = (facilityId: string) => {
    setSelectedFacilityId(facilityId);
  };

  useEffect(() => {
    // scroll to searchResult
    searchResultsRefs &&
      selectedFaciltyId &&
      searchResultsRefs[selectedFaciltyId]?.current?.scrollIntoView();
  }, [selectedFaciltyId, searchResultsRefs]);

  const resultsContainerStyle: CSSProperties = {
    paddingLeft: 20,
    paddingRight: 20
  };

  //TODO: determine when to show, and when to to show facilities.
  // if (filteredFacilities.length === 0 || searchParams === undefined) {
  //   return null;
  // }

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
            {error && 'Something went wrong '}
          </MessageBox>
        </Box>
        <Box gap="0.5rem" flex={false} style={resultsContainerStyle}>
          {/* Currenlty we are displaying accomdations, but this may need to be changed to offers */}
          {accommodations?.map((facility, idx) => (
            <SearchResult
              key={facility.id}
              facility={facility}
              isSelected={facility.id === selectedFaciltyId}
              onSelect={handleFacilitySelection}
              ref={searchResultsRefs[idx]}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
