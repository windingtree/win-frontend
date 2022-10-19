import { Box, Button, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { createRef, useCallback, useEffect, useMemo, useState } from 'react';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers';
import { SearchCard } from './SearchCard';
import { useAppState } from '../store';
import { styled } from '@mui/system';
import { daysBetween } from '../utils/date';
import { HEADER } from 'src/config/componentSizes';
import { useSearchParams } from 'react-router-dom';
import { accommodationEventTransform } from '../hooks/useAccommodationsAndOffers/helpers';
import Draggable from 'react-draggable';

export enum ResultsMode {
  map,
  list
}

const StyledContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  zIndex: '1',
  width: '100%',
  top: '90%',
  height: '10%',
  left: 0,
  padding: theme.spacing(0, 2),
  backgroundColor: '#fff',
  transition: 'all 0.4s ease',
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

const ScrollableContainer = styled(Box)<{ mode: boolean }>(({ theme, mode }) => ({
  height: 'calc(100% - 24px)',
  overflow: mode ? 'hidden' : 'scroll',
  [theme.breakpoints.up('md')]: {
    height: '100%'
  }
}));

const SelectedFacilityContainer = styled(Box)(({ theme }) => {
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'));
  const isMobileSafari =
    isMobileView && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  return {
    position: 'fixed',
    top: isMobileSafari ? 'calc(79.5% - 132px)' : 'calc(89.5% - 132px)',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '1',
    maxWidth: '100vw',
    [theme.breakpoints.up('md')]: {
      visibility: 'hidden'
    }
  };
});

const DragContainer = styled(Stack)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  zIndex: '2',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'calc(100vw)',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1, 0),
  background: theme.palette.background.default,
  [theme.breakpoints.up('md')]: {
    visibility: 'hidden'
  }
}));

export const Results: React.FC = () => {
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'));
  const isMobileSafari =
    isMobileView && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const [viewSx, setViewSx] = useState({});
  const [mode, setMode] = useState<ResultsMode>(ResultsMode.map);
  const [depth, setDepth] = useState(0);
  useEffect(() => {
    if (mode === ResultsMode.map) {
      setViewSx(
        isMobileSafari ? { height: '20%', top: '80%' } : { height: '10%', top: '90%' }
      );
    } else {
      setViewSx({
        height: '75%',
        top: '25%'
      });
    }
  }, [mode]);

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
  const numberOfDays = useMemo(
    () => daysBetween(latestQueryParams?.arrival, latestQueryParams?.departure),
    [latestQueryParams]
  );

  // handle drag event switching map/list views
  const handleSwitch = useCallback(
    (e) => {
      if (e.type === 'touchmove') {
        if (depth > e.targetTouches[0]?.screenY) {
          setMode(ResultsMode.list);
        }
        if (depth < e.targetTouches[0]?.screenY) {
          setMode(ResultsMode.map);
        }
        setDepth(e.targetTouches[0]?.screenY);
      } else {
        if (depth > e.screenY) {
          setMode(ResultsMode.list);
        }
        if (depth < e.screenY) {
          setMode(ResultsMode.map);
        }
        setDepth(e.screenY);
      }
    },
    [mode, depth]
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
      mode === ResultsMode.list &&
      SearchCardsRefs[selectedFacilityId]?.current?.scrollIntoView();
  }, [selectedFacilityId, SearchCardsRefs, mode]);

  if (!accommodations || accommodations.length === 0) {
    return null;
  }

  // find selected facility
  const selectedFacility = accommodations.find((accommodation) => {
    return accommodation.id === selectedFacilityId;
  });

  const showSelectedFacility = !!(
    isMobileView &&
    mode === ResultsMode.map &&
    selectedFacility
  );

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
      <StyledContainer sx={viewSx} className="noScrollBar">
        <Draggable
          axis="y"
          handle=".handle"
          position={{ x: 0, y: 0 }}
          defaultPosition={{ x: 0, y: 0 }}
          grid={[25, 25]}
          scale={1}
          onDrag={(e) => handleSwitch(e)}
        >
          <Box height="calc(100% - 24px)">
            <Box paddingTop={isMobileView ? 6 : 0} className="handle">
              <DragContainer>
                <Box
                  sx={{
                    justifySelf: 'center',
                    alignSelf: 'center',
                    width: '10rem',
                    background: 'black',
                    height: '4px',
                    borderRadius: '2px'
                  }}
                />
                <Typography textAlign="center">{accommodations.length} stays</Typography>
              </DragContainer>
            </Box>

            {isMobileView && mode === ResultsMode.list && (
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
            <ScrollableContainer
              className="noScrollBar"
              mode={isMobileView && mode === ResultsMode.map}
            >
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
            </ScrollableContainer>
          </Box>
        </Draggable>
      </StyledContainer>
    </>
  );
};
