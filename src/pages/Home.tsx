import type { LatLngTuple } from 'leaflet';
import { useAppState } from '../store';
import { MainLayout } from '../layouts/MainLayout';
import { Search } from '../components/Search';
import { useState } from 'react';

const defaultCenter: LatLngTuple = [51.505, -0.09];

export const Home = () => {
  const { isConnecting } = useAppState();
  const [center, setCenter] = useState<LatLngTuple>(defaultCenter);

  return (
    <MainLayout>
      {!isConnecting && <Search center={center} onSubmit={setCenter} />}
    </MainLayout>
  );
};
