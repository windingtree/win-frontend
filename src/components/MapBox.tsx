import type { Map, LatLngTuple, LatLngExpression } from 'leaflet';
import { Box } from 'grommet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import Logger from '../utils/logger';
import L from 'leaflet';
import { geoToH3, h3ToGeoBoundary, kRing } from 'h3-js';
import { utils } from '@windingtree/videre-sdk';
import { useAppState } from '../store';

const logger = Logger('MapBox');
const defaultZoom = 13;

const pinIcon = new L.Icon({
  iconUrl: require('../images/pin.svg'),
  iconRetinaUrl: require('../images/pin.svg'),
  iconSize: new L.Point(20, 20),
  className: 'leaflet-div-icon'
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
    logger.debug(`latitude: ${position.lat.toFixed(4)}, longitude: ${position.lng.toFixed(4)}`);
  }, [position]);

  useEffect(() => {
    logger.debug(`zoom: ${zoom}`);
  }, [zoom]);

  useEffect(() => {
    const h3 = geoToH3(center[0], center[1], utils.constants.DefaultH3Resolution);
    const h3Indexes = kRing(h3, utils.constants.DefaultRingSize);

    h3Indexes.forEach((h) => {
      L.polygon(h3ToGeoBoundary(h) as unknown as LatLngExpression[][], { color: 'red' }).addTo(map);
    });
  }, [center, map]);

  return null;
};

export const MapBox: React.FC<{
  center: LatLngTuple;
}> = ({ center }) => {
  const [map, setMap] = useState<Map | null>(null);
  const { facilities } = useAppState();

  const displayMap = useMemo(
    () => (
      <MapContainer
        zoomControl={false}
        center={center}
        zoom={defaultZoom}
        style={{
          height: '100vh',
          // width: "100vw",
          position: 'relative',
          zIndex: 0
        }}
        scrollWheelZoom={false}
        ref={setMap}
      >
        <TileLayer
          zIndex={10}
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position='bottomleft' />
        {(facilities && facilities.length > 0)
          ? (facilities).map((f) => (
            <Marker key={f.id} icon={pinIcon} position={[f.location.lat, f.location.long]}>
              <Popup>
                {f.name} <br /> Easily customizable.
              </Popup>
            </Marker>
          ))
          : null}
      </MapContainer>
    ),
    [center, facilities]
  );

  return (
    <Box>
      {map ? <MapSettings center={center} map={map} /> : null}
      {displayMap}
    </Box>
  );
};
