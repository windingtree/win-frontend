import { Box, Button, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { createRef, useCallback, useEffect, useMemo } from 'react';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';
import { SearchCard } from './SearchCard';
import { useAppState } from '../store';
import { styled } from '@mui/system';
import { daysBetween } from '../utils/date';
import { HEADER } from 'src/config/componentSizes';
import { useSearchParams } from 'react-router-dom';
import { accommodationEventTransform } from '../hooks/useAccommodationsAndOffers.tsx/helpers';
import { useWindowScrollPositions } from 'src/hooks/useWindowScrollPositions';

export enum ResultsMode {
  map,
  list
}

const StyledContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  zIndex: '1',
  width: '100%',
  top: '90%',
  left: 0,
  padding: theme.spacing(0, 2),
  backgroundColor: '#fff',
  transition: 'all 0.4s ease',

  [theme.breakpoints.up('md')]: {
    overflow: 'scroll',
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

const SelectedFacilityContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 'calc(89.5% - 132px)',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: '1',
  maxWidth: '100vw',
  [theme.breakpoints.up('md')]: {
    visibility: 'hidden'
  }
}));

export const Results: React.FC = () => {
  const theme = useTheme();
  const showResultsNumber = useMediaQuery(theme.breakpoints.down('md'));
  const { scrollY } = useWindowScrollPositions();

  // to highlight a given event marker use url params "focusedEvent"
  const [searchParams] = useSearchParams();
  const focusedEvent = useMemo(
    () => searchParams.get('focusedEvent') ?? '',
    [searchParams]
  );
  const listView = scrollY > innerHeight - 600;
  // apply a callback function to transform returned accommodation objects
  const transformFn = useCallback(accommodationEventTransform(focusedEvent), [
    focusedEvent
  ]);
  const { accommodations, isFetching, latestQueryParams } = useAccommodationsAndOffers({
    accommodationTransformFn: transformFn
  });

  const { selectedFacilityId } = useAppState();
  const numberOfDays = useMemo(
    () => daysBetween(latestQueryParams?.arrival, latestQueryParams?.departure),
    [latestQueryParams]
  );

  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

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
      listView &&
      SearchCardsRefs[selectedFacilityId]?.current?.scrollIntoView();
  }, [selectedFacilityId, SearchCardsRefs]);

  if (!accommodations || accommodations.length === 0) {
    return null;
  }

  // find selected facility
  const selectedFacility = accommodations.find((accommodation) => {
    return accommodation.id === selectedFacilityId;
  });

  const showSelectedFacility = !!(showResultsNumber && !listView && selectedFacility);

  return (
    <>
      {showSelectedFacility && (
        <SelectedFacilityContainer>
          <SearchCard
            facility={selectedFacility}
            numberOfDays={numberOfDays}
            focusedEvent={selectedFacility.eventInfo}
            mapCard={true}
          />
        </SelectedFacilityContainer>
      )}
      <StyledContainer className="noScrollBar">
        {showResultsNumber && (
          <Stack direction="column" alignItems="center" justifyContent="center">
            <Box
              sx={{
                justifySelf: 'center',
                alignSelf: 'center',
                background: 'black',
                width: '10rem',
                height: '4px',
                borderRadius: '2px',
                mt: theme.spacing(1)
              }}
            />
            <Typography textAlign="center">{accommodations.length} stays</Typography>
          </Stack>
        )}
        {showResultsNumber && listView && (
          <Box
            position="fixed"
            bottom={theme.spacing(4)}
            left="50%"
            width={'64px'}
            marginLeft={'-32px'}
            zIndex={2}
          >
            <Button variant="contained" onClick={() => handleScrollToTop()}>
              Map
            </Button>
          </Box>
        )}
        <Box sx={{ overflow: 'scroll' }}>
          <Stack>
            {!isFetching &&
              accommodations.map((facility, idx) => (
                <SearchCard
                  key={facility.id}
                  facility={facility}
                  numberOfDays={numberOfDays}
                  isSelected={facility.id === selectedFacilityId}
                  ref={SearchCardsRefs[idx]}
                  focusedEvent={facility.eventInfo}
                />
              ))}
          </Stack>
        </Box>
      </StyledContainer>
    </>
  );
};
