import { Box, Button, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { createRef, useCallback, useEffect, useMemo, useState } from 'react';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';
import { SearchCard } from './SearchCard';
import { useAppState, useAppDispatch } from '../store';
import { styled } from '@mui/system';
import { daysBetween } from '../utils/date';
import { HEADER } from 'src/config/componentSizes';
import { useSearchParams } from 'react-router-dom';
import { accommodationEventTransform } from '../hooks/useAccommodationsAndOffers.tsx/helpers';

export enum ResultsMode {
  map,
  list
}

const StyledContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  zIndex: '1',
  width: '100%',
  height: '50%',
  top: '50%',
  left: 0,
  // m: 0,
  padding: theme.spacing(0, 2),
  backgroundColor: '#fff',
  transition: 'all 0.4s ease',

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
  const theme = useTheme();
  const showResultsNumber = useMediaQuery(theme.breakpoints.down('md'));

  const [viewSx, setViewSx] = useState({});
  const [mode, setMode] = useState<ResultsMode>(ResultsMode.map);

  useEffect(() => {
    if (mode === ResultsMode.map) {
      setViewSx({
        height: '10%',
        top: '90%'
      });
    } else {
      setViewSx({
        height: '75%',
        top: '25%'
      });
    }
  }, [mode]);

  // handle mobile list scrolling
  // const handleScroll = useCallback(
  //   (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
  //     if (e.currentTarget.scrollTop > 10) {
  //       setMode(ResultsMode.list);
  //     }
  //     if (e.currentTarget.scrollTop === 0) {
  //       setMode(ResultsMode.map);
  //     }
  //   },
  //   [setMode]
  // );

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
    <StyledContainer sx={viewSx}>
      {showResultsNumber && (
        <Stack
          direction="column"
          alignItems="center"
          paddingTop={2}
          onClick={() =>
            setMode(mode === ResultsMode.map ? ResultsMode.list : ResultsMode.map)
          }
        >
          <Box
            sx={{
              justifySelf: 'center',
              alignSelf: 'center',
              background: 'black',
              width: '10rem',
              height: '4px',
              borderRadius: '2px'
            }}
          />
          <Typography textAlign="center">{accommodations.length} stays</Typography>
        </Stack>
      )}
      {mode === ResultsMode.list && (
        <Box
          position="fixed"
          bottom={theme.spacing(4)}
          left="50%"
          width={'64px'}
          marginLeft={'-32px'}
          zIndex={2}
        >
          <Button variant="contained" onClick={() => setMode(ResultsMode.map)}>
            Map
          </Button>
        </Box>
      )}
      {mode === ResultsMode.list && (
        <Box
          sx={{ overflow: 'scroll', height: '90%', p: 0, m: 0 }}
          className="noScrollBar"
        >
          <Stack>
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
          </Stack>
        </Box>
      )}
    </StyledContainer>
  );
};
