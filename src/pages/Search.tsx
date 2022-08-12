import type { LatLngTuple } from 'leaflet';
import { useAppState } from '../store';
import { MainLayout } from '../layouts/MainLayout';
import { Search as CSearch } from '../components/Search';
import { MapBox } from '../components/MapBox';
import { Box } from 'grommet';
import { useState } from 'react';
import { Results } from '../components/Results';

const defaultCenter: LatLngTuple = [51.505, -0.09];

export const Search = () => {
  const { isConnecting } = useAppState();
  const [center, setCenter] = useState<LatLngTuple>(defaultCenter);

  return (
    <MainLayout kind="full">
      {!isConnecting && (
        <Box style={{ position: 'relative' }}>
          <Results center={center} />
          <MapBox center={center} />
          <Box
            background="white"
            style={{ position: 'absolute', bottom: 20, alignSelf: 'center', zIndex: 1 }}
          >
            <CSearch center={center} onSubmit={setCenter} />
          </Box>
        </Box>
      )}
    </MainLayout>
  );
};
