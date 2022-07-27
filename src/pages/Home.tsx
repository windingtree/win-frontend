import type { LatLngTuple } from 'leaflet';
import { useAppState } from '../store';
import { PageWrapper } from './PageWrapper';
import { Search } from '../components/Search';
import { MapBox } from '../components/MapBox';
import { Box, Button } from 'grommet';
import { useState } from 'react';
import { Results } from '../components/Results';
import { Search as ISearch, Close } from 'grommet-icons';

const defaultCenter: LatLngTuple = [51.505, -0.09];

export const Home = () => {
  const { isConnecting } = useAppState();
  const [center, setCenter] = useState<LatLngTuple>(defaultCenter);
  const [open, setOpen] = useState<boolean>(true);

  return (
    <PageWrapper kind="full">
      {!isConnecting && (
        <Box style={{ position: 'relative' }}>
          <Button
            style={{
              position: 'absolute',
              bottom: '1rem',
              zIndex: `${open ? '1' : '1'}`,
              alignSelf: 'center',
              background: 'white',
              // width: '70%',
              margin: '1rem',
              // padding: '0.75rem',
              borderRadius: '0.5rem',
              boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px'
            }}
            onClick={() => setOpen(!open)}
            justify="end"
            icon={open ? <Close size="medium" /> : <ISearch size="medium" />}
          />
          <Search open={open} setOpen={setOpen} center={center} onSubmit={setCenter} />
          <Results center={center} />
          <MapBox center={center} />
        </Box>
      )}
    </PageWrapper>
  );
};
