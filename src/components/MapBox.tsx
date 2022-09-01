import { Map, LatLngTuple, Icon } from 'leaflet';
import { Box, CircularProgress, Container } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import Logger from '../utils/logger';
import icon from 'leaflet/dist/images/marker-icon.png';
import { useAppDispatch, useAppState } from '../store';
import { useAccommodationsAndOffers } from 'src/hooks/useAccommodationsAndOffers.tsx';
import { FacilityRecord } from 'src/store/types';
import { SearchCard } from './SearchCard';
import { daysBetween } from '../utils/date';

const logger = Logger('MapBox');
const defaultZoom = 13;
const pinIcon = new Icon({
  iconUrl: icon,
  iconSize: [25, 40]
});

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

const getCoordinates = (facility: FacilityRecord): LatLngTuple | undefined => {
  let coordinates: LatLngTuple | undefined = undefined;

  coordinates = [...(facility.location.coordinates || [])].reverse() as LatLngTuple;

  return coordinates;
};

export const MapBox: React.FC = () => {
  const [map, setMap] = useState<Map | null>(null);
  const { selectedFacilityId } = useAppState();
  const dispatch = useAppDispatch();

  // TODO: replace this with activeAccommodations
  const { accommodations, coordinates, isLoading, latestQueryParams } =
    useAccommodationsAndOffers();
  const numberOfDays = useMemo(
    () => daysBetween(latestQueryParams?.arrival, latestQueryParams?.departure),
    [latestQueryParams]
  );

  const normalizedCoordinates: LatLngTuple = coordinates
    ? [coordinates.lat, coordinates.lon]
    : [51.505, -0.09];

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

  const displayMap = useMemo(
    () => (
      <MapContainer
        zoomControl={false}
        center={normalizedCoordinates}
        zoom={defaultZoom}
        style={{
          height: '90vh',
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
        {accommodations && accommodations.length > 0
          ? accommodations.map(
              (f) =>
                f.location &&
                f.location.coordinates && (
                  <Marker
                    key={f.id}
                    icon={pinIcon}
                    position={[f.location.coordinates[1], f.location.coordinates[0]]}
                    eventHandlers={{
                      click: () => selectFacility(f.id),
                      mouseover: (event) => event.target.openPopup()
                    }}
                  >
                    <Popup>
                      <SearchCard
                        key={f.id}
                        facility={f}
                        isSelected={f.id === selectedFacilityId}
                        numberOfDays={numberOfDays}
                      />
                    </Popup>
                  </Marker>
                )
            )
          : null}
      </MapContainer>
    ),
    [normalizedCoordinates, accommodations, selectedFacilityId]
  );

  return (
    <Box>
      {map ? <MapSettings center={normalizedCoordinates} map={map} /> : null}
      {isLoading ? (
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80vh'
          }}
        >
          <CircularProgress />
        </Container>
      ) : (
        displayMap
      )}
    </Box>
  );
};
