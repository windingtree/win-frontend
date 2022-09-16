import { Map, LatLngTuple, DivIcon, Icon } from 'leaflet';
import {
  Alert,
  Backdrop,
  Box,
  CircularProgress,
  GlobalStyles,
  styled,
  Typography,
  Stack
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
} from 'src/hooks/useAccommodationsAndOffers.tsx';
import { SearchCard } from './SearchCard';
import { daysBetween } from '../utils/date';
import { useSearchParams } from 'react-router-dom';
import { currencySymbolMap } from '../utils/currencies';
import { useCurrentEvents } from '../hooks/useCurrentEvents';
import { InvalidLocationError } from '../hooks/useAccommodationsAndOffers.tsx/helpers';

const logger = Logger('MapBox');
const defaultZoom = 13;

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

  // to highlight a given event marker use url params "focusedEvent"
  const [searchParams] = useSearchParams();
  const focusedEvent = useMemo(() => searchParams.get('focusedEvent'), [searchParams]);

  // TODO: replace this with activeAccommodations
  const {
    accommodations,
    coordinates,
    isLoading,
    latestQueryParams,
    isFetching,
    error,
    focusedEventCoordinates
  } = useAccommodationsAndOffers(undefined, focusedEvent);
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

  const currentEventsWithinRadius = useCurrentEvents({
    fromDate: latestQueryParams?.arrival,
    toDate: latestQueryParams?.departure,
    center: coordinates
  });

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
            backgroundColor: theme.palette.error.main,
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
    if (focusedEvent && focusedEventCoordinates) {
      result = focusedEventCoordinates;
    }
    return result;
  }, [focusedEvent]);

  const normalizedCoordinates: LatLngTuple =
    focusedCoordinates ??
    (coordinates ? [coordinates.lat, coordinates.lon] : [51.505, -0.09]);

  const displayMap = useMemo(
    () => (
      <MapContainer
        zoomControl={false}
        maxZoom={16}
        minZoom={10}
        center={normalizedCoordinates}
        zoom={defaultZoom}
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
          zIndex={10}
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright" />
        {mapMarkerStyles}
        {eventMarkers}
        {accommodations && accommodations.length > 0
          ? accommodations.map((f) => {
              if (f.location && f.location.coordinates) {
                return (
                  <Marker
                    key={f.id}
                    icon={getPriceMarkerIcon(f.lowestPrice)}
                    position={[f.location.coordinates[1], f.location.coordinates[0]]}
                    eventHandlers={{
                      click: () => selectFacility(f.id)
                    }}
                  >
                    <Popup>
                      <SearchCard
                        key={f.id}
                        sm={true}
                        facility={f}
                        isSelected={f.id === selectedFacilityId}
                        numberOfDays={numberOfDays}
                        focusedEvent={f.eventInfo}
                      />
                    </Popup>
                  </Marker>
                );
              } else {
                return null;
              }
            })
          : null}
      </MapContainer>
    ),
    [normalizedCoordinates, accommodations, selectedFacilityId]
  );

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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
