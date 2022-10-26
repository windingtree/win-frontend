import { Map, LatLngTuple, DivIcon, Icon, circle } from 'leaflet';
import {
  Alert,
  Backdrop,
  Box,
  CircularProgress,
  GlobalStyles,
  styled,
  Typography,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  ZoomControl
} from 'react-leaflet';
import defaultIconUrl from 'leaflet/dist/images/marker-icon.png';
import Logger from '../utils/logger';
import { useAppDispatch, useAppState } from '../store';
import {
  LowestPriceFormat,
  useAccommodationsAndOffers
} from 'src/hooks/useAccommodationsAndOffers';
import { SearchCard } from '../containers/search/SearchCard';
import { daysBetween } from '../utils/date';
import { useSearchParams } from 'react-router-dom';
import { currencySymbolMap } from '../utils/currencies';
import {
  accommodationEventTransform,
  InvalidLocationError
} from '../hooks/useAccommodationsAndOffers/helpers';
import { getActiveEventsWithinRadius } from '../utils/events';
import { AppMode } from '../config';

const logger = Logger('MapBox');
const defaultZoom = 13;
const defaultFocusedZoomRadius = 3000; // in meters

const mapAttribution =
  (process.env.REACT_APP_MODE === AppMode.prod ||
    process.env.REACT_APP_MODE === AppMode.stage) &&
  process.env.REACT_APP_MAPTILER_API_KEY !== undefined
    ? '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e'
    : '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
const mapTileUrl =
  (process.env.REACT_APP_MODE === AppMode.prod ||
    process.env.REACT_APP_MODE === AppMode.stage) &&
  process.env.REACT_APP_MAPTILER_API_KEY !== undefined
    ? `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${process.env.REACT_APP_MAPTILER_API_KEY}`
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

const getPriceMarkerIcon = ({ price, currency }: LowestPriceFormat, focused = false) => {
  const currencySymbol = currencySymbolMap[currency];

  return new DivIcon({
    html: `<div>${currencySymbol} ${Math.ceil(price)}</div>`,
    className: `map-marker-icon ${focused ? 'marker-focused' : ''}`
  });
};

const getImageIcon = ({
  imageUrl,
  rounded = false,
  size = [40, 40]
}: {
  imageUrl?: string;
  rounded?: boolean;
  size?: [number, number];
}) => {
  return new Icon({
    iconUrl: imageUrl ?? defaultIconUrl,
    iconSize: imageUrl ? size : [40, 64],
    className: `${rounded ? 'marker-rounded' : ''}`
  });
};

const MapSettings: React.FC<{
  center: LatLngTuple;
  map: Map;
}> = ({ map, center }) => {
  const [position, setPosition] = useState(() => map.getCenter());
  const [zoom, setZoom] = useState(() => map.getZoom());
  const dispatch = useAppDispatch();

  const onPopupClose = useCallback(() => {
    dispatch({
      type: 'RESET_SELECTED_FACILITY_ID'
    });
  }, []);

  const onMove = useCallback(() => {
    setPosition(map.getCenter());
  }, [map]);

  const onZoom = useCallback(() => {
    setZoom(map.getZoom());
  }, [map]);

  useEffect(() => {
    map.on('move', onMove);
    return () => {
      map.off('move', onMove);
    };
  }, [map, onMove]);

  useEffect(() => {
    map.on('popupclose', onPopupClose);
    return () => {
      map.off('popupclose', onPopupClose);
    };
  }, [map, onPopupClose]);

  useEffect(() => {
    map.on('click', onPopupClose);
    return () => {
      map.off('click', onPopupClose);
    };
  }, [map, onPopupClose]);

  useEffect(() => {
    map.on('zoom', onZoom);
    return () => {
      map.off('zoom', onZoom);
    };
  }, [map, onZoom]);

  useEffect(() => {
    logger.debug('onMove', center);
    map.setView(center);
  }, [map, center]);

  useEffect(() => {
    logger.debug('onZoom', zoom);
    map.setZoom(zoom);
  }, [zoom, map]);

  useEffect(() => {
    logger.debug(
      `latitude: ${position.lat.toFixed(4)}, longitude: ${position.lng.toFixed(4)}`
    );
  }, [position]);

  useEffect(() => {
    logger.debug(`zoom: ${zoom}`);
  }, [zoom]);

  return null;
};

const NoMapBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.background.default
}));

export const MapBox: React.FC = () => {
  const [map, setMap] = useState<Map | null>(null);
  const { selectedFacilityId } = useAppState();
  const dispatch = useAppDispatch();

  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'));

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
  const { accommodations, coordinates, isLoading, latestQueryParams, isFetching, error } =
    useAccommodationsAndOffers({
      accommodationTransformFn: transformFn
    });
  const numberOfDays = useMemo(
    () => daysBetween(latestQueryParams?.arrival, latestQueryParams?.departure),
    [latestQueryParams]
  );

  const selectFacility = (facilityId: string) => {
    dispatch({
      type: 'SET_SELECTED_FACILITY_ID',
      payload: facilityId
    });
  };

  const unSelectFacility = () => {
    dispatch({
      type: 'RESET_SELECTED_FACILITY_ID'
    });
  };

  // on mount clear selected facility id
  useEffect(() => {
    unSelectFacility();
  }, []);

  const currentEvents = useMemo(
    () =>
      getActiveEventsWithinRadius({
        fromDate: latestQueryParams?.arrival,
        toDate: latestQueryParams?.departure,
        center: coordinates,
        focusedEvent
      }),
    [coordinates, latestQueryParams]
  );

  const { currentEventsWithinRadius = null, focusedEventItem = null } =
    currentEvents ?? {};

  // show markers of events within given radius
  const eventMarkers = useMemo(() => {
    const markers = currentEventsWithinRadius?.length ? (
      <>
        {currentEventsWithinRadius.map(
          (evt) =>
            evt.latlon && (
              <Marker
                key={evt.name}
                icon={getImageIcon({
                  imageUrl: evt.mapIcon?.url,
                  rounded: evt.mapIcon?.rounded,
                  size: [50, 73]
                })}
                position={[evt.latlon[0], evt.latlon[1]]}
              >
                <Tooltip direction="top" offset={[0, -37]}>
                  <Stack>
                    <Typography variant="subtitle2">{evt.name}</Typography>
                    <Typography variant="subtitle2">{evt.date}</Typography>
                  </Stack>
                </Tooltip>
              </Marker>
            )
        )}
      </>
    ) : null;

    return markers;
  }, [latestQueryParams]);

  const mapMarkerStyles = useMemo(
    () => (
      <GlobalStyles
        styles={(theme) => ({
          '.map-marker-icon': {
            backgroundColor: theme.palette.common.white,
            fontSize: theme.typography.body2.fontSize,
            fontWeight: theme.typography.fontWeightBold,
            borderRadius: theme.spacing(2),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'auto !important',
            height: 'auto !important',
            padding: `${theme.spacing(0.1)} ${theme.spacing(1)}`,
            whiteSpace: 'nowrap',
            boxShadow: `0 0 10px 0 ${theme.palette.grey[500]}`
          },
          '.marker-focused': {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white
          },
          '.marker-rounded': {
            //
          }
        })}
      />
    ),
    []
  );

  // determine from search url if there is a relevant area to focus
  const focusedCoordinates: LatLngTuple | undefined = useMemo(() => {
    let result;

    // if search url contains a focusedEvent we should center map to it
    if (focusedEventItem) {
      result = focusedEventItem.latlon;
    }
    return result;
  }, [focusedEventItem]);

  const normalizedCoordinates: LatLngTuple = useMemo(() => {
    return (
      focusedCoordinates ??
      (coordinates ? [coordinates.lat, coordinates.lon] : [51.505, -0.09])
    );
  }, [focusedCoordinates, coordinates]);

  const displayMap = useMemo(
    () => (
      <MapContainer
        attributionControl={false}
        zoomControl={false}
        maxZoom={16}
        minZoom={10}
        center={normalizedCoordinates}
        zoom={defaultZoom}
        zoomSnap={0.25} // allow fractional zoom
        style={{
          height: '100vh',
          // width: "100vw",
          position: 'relative',
          zIndex: 0
        }}
        scrollWheelZoom={true}
        ref={setMap}
      >
        <TileLayer
          crossOrigin={true}
          zIndex={10}
          attribution={mapAttribution}
          url={mapTileUrl}
        />
        <ZoomControl position="topright" />
        {mapMarkerStyles}
        {eventMarkers}
        {accommodations && accommodations.length > 0
          ? accommodations.map((f) => {
              const isSelected = f.id === selectedFacilityId;
              if (f.location && f.location.coordinates) {
                return (
                  <Marker
                    key={f.id}
                    icon={getPriceMarkerIcon(f.lowestPrice, isSelected)}
                    position={[f.location.coordinates[1], f.location.coordinates[0]]}
                    eventHandlers={{
                      click: () =>
                        isSelected ? unSelectFacility() : selectFacility(f.id)
                    }}
                  >
                    {isMobileView ? null : (
                      // hide popup in mobile view, shown in "Results" component
                      <Popup>
                        <SearchCard
                          key={f.id}
                          mapCard={true}
                          facility={f}
                          isSelected={isSelected}
                          numberOfDays={numberOfDays}
                          focusedEvent={f.eventInfo}
                        />
                      </Popup>
                    )}
                  </Marker>
                );
              } else {
                return null;
              }
            })
          : null}
      </MapContainer>
    ),
    [normalizedCoordinates, accommodations, selectedFacilityId, isMobileView]
  );

  useEffect(() => {
    if (map && focusedCoordinates) {
      // evaluate bounding rectangle
      const radiusCircle = circle(focusedCoordinates, {
        radius: defaultFocusedZoomRadius,
        opacity: 0,
        fillOpacity: 0
      }).addTo(map);
      const boundingRectangle = radiusCircle.getBounds();

      // zoom to bounding rectangle
      map.fitBounds(boundingRectangle);
      map.removeLayer(radiusCircle);
    }
  }, [map, focusedCoordinates]);

  const invalidLocation = error instanceof InvalidLocationError;

  return (
    <Box>
      {map && !isFetching && !isLoading && !invalidLocation ? (
        <MapSettings center={normalizedCoordinates} map={map} />
      ) : null}
      <Backdrop
        sx={{ background: 'transparent', backdropFilter: 'blur(8px)', zIndex: 1 }}
        open={isLoading || isFetching}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mx: 1
          }}
        >
          <CircularProgress />
          <Alert
            sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center', mt: 2 }}
            severity="info"
          >
            Great accommodations take a little longer to find! Please be patient.
          </Alert>
        </Box>
      </Backdrop>
      {invalidLocation ? <NoMapBox /> : <>{displayMap}</>}
    </Box>
  );
};
