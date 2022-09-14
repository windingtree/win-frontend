import { Map, LatLngTuple, DivIcon, Icon } from 'leaflet';
import {
  Alert,
  Backdrop,
  Box,
  CircularProgress,
  GlobalStyles,
  styled
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import defaultIconUrl from 'leaflet/dist/images/marker-icon.png';
import Logger from '../utils/logger';
import { useAppDispatch, useAppState } from '../store';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';
import { SearchCard } from './SearchCard';
import { daysBetween } from '../utils/date';
import { useSearchParams } from 'react-router-dom';
import { currencySymbolMap } from '../utils/currencies';
import { InvalidLocationError } from '../hooks/useAccommodationsAndOffers.tsx/helpers';
import { getCurrentEvents, getEventsWithinRadius } from '../utils/events';

const logger = Logger('MapBox');
const defaultZoom = 13;

interface LowestPriceFormat {
  price: number;
  currency: string;
  decimals?: number;
}

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
  size = 40
}: {
  imageUrl?: string;
  rounded?: boolean;
  size?: number;
}) => {
  return new Icon({
    iconUrl: imageUrl ?? defaultIconUrl,
    iconSize: imageUrl ? [size, size] : [40, 64],
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
    map.setView(center, defaultZoom);
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

  // to highlight a given marker use url params "focusedFacilityId"
  const [searchParams] = useSearchParams();
  const focusedFacilityId = useMemo(
    () => searchParams.get('focusedFacilityId'),
    [searchParams]
  );

  // TODO: replace this with activeAccommodations
  const { accommodations, coordinates, isLoading, latestQueryParams, isFetching, error } =
    useAccommodationsAndOffers();
  const numberOfDays = useMemo(
    () => daysBetween(latestQueryParams?.arrival, latestQueryParams?.departure),
    [latestQueryParams]
  );

  const accommodationsWithLowestPrice = useMemo(
    () =>
      accommodations?.length &&
      accommodations.map((accommodation) => {
        const lowestPrice = accommodation.offers
          .map((offer) => ({
            price: Number(offer.price.public) / numberOfDays,
            currency: offer.price.currency
          }))
          .reduce((prevLowest, currentVal) =>
            prevLowest.price < currentVal.price ? prevLowest : currentVal
          );
        return { ...accommodation, lowestPrice };
      }),
    [accommodations]
  );

  // if search url contains a focusedFacilityId we should center map to it
  const focusedCoordinates: LatLngTuple | undefined = useMemo(() => {
    let result;
    if (focusedFacilityId) {
      const facility = accommodations.find((fac) => fac.id === focusedFacilityId);
      if (facility) {
        result = [facility.location.coordinates[1], facility.location.coordinates[0]];
      }
    }
    return result;
  }, [accommodations]);

  const normalizedCoordinates: LatLngTuple =
    focusedCoordinates ??
    (coordinates ? [coordinates.lat, coordinates.lon] : [51.505, -0.09]);

  const selectFacility = (facilityId: string) => {
    dispatch({
      type: 'SET_SELECTED_FACILITY_ID',
      payload: facilityId
    });
  };

  useEffect(() => {
    // scroll to facility when selectedFacilityId changes
    if (selectedFacilityId) {
      const facility = accommodations.find((fac) => fac.id === selectedFacilityId);
      if (facility) {
        // change the priced pin color
      }
    }
  }, [selectedFacilityId]);

  const eventMarkers = useMemo(() => {
    const currentEvents =
      latestQueryParams?.arrival &&
      latestQueryParams?.departure &&
      // add 3 day swing
      getCurrentEvents({
        fromDate: new Date(latestQueryParams.arrival.setDate(latestQueryParams.arrival.getDate() - 3)),
        toDate: new Date(latestQueryParams.departure.setDate(latestQueryParams.departure.getDate() + 3))
      });

    const maxRadius = 3; // TO-DO: convert to miles if needed
    const currentEventsWithinRadius =
      currentEvents &&
      getEventsWithinRadius(currentEvents, normalizedCoordinates, maxRadius);

    return currentEventsWithinRadius?.length ? (
      <>
        {currentEventsWithinRadius.map(
          (evt) =>
            evt.latlon && (
              <Marker
                key={evt.name}
                icon={getImageIcon({
                  imageUrl: evt.mapIcon?.url,
                  rounded: evt.mapIcon?.rounded,
                  size: 100
                })}
                position={[evt.latlon[0], evt.latlon[1]]}
              />
            )
        )}
      </>
    ) : null;
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
            borderRadius: '50%',
            boxShadow: `0 0 15px 0 ${theme.palette.grey[500]}`
          }
        })}
      />
    ),
    []
  );

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
        {accommodationsWithLowestPrice && accommodationsWithLowestPrice.length > 0
          ? accommodationsWithLowestPrice.map((f) => {
              if (f.location && f.location.coordinates) {
                return (
                  <Marker
                    key={f.id}
                    icon={getPriceMarkerIcon(
                      f.lowestPrice,
                      f.hotelId + f.name === focusedFacilityId
                    )}
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
