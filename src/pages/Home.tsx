import type { LatLngTuple } from 'leaflet';
import { useAppState } from '../store';
import { PageWrapper } from './PageWrapper';
import { Search } from '../components/Search';
import { MapBox } from '../components/MapBox';
import { Box, Button, ResponsiveContext } from 'grommet';
import { useContext, useState } from 'react';
import { Results } from '../components/Results';
import { Search as ISearch, Close } from 'grommet-icons';

const defaultCenter: LatLngTuple = [51.505, -0.09];

export const Home = () => {
  const { isConnecting } = useAppState();
  const [center, setCenter] = useState<LatLngTuple>(defaultCenter);
  const [open, setOpen] = useState<boolean>(true);
  const size = useContext(ResponsiveContext);

  return (
    <PageWrapper kind="full">
      {!isConnecting && (
        <Box  pad='0' style={{ position: 'relative' }}>
          <Button
            margin={size}
            style={{
              position: 'absolute',
              zIndex: '1',
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
            icon={open ? <Close size={size} /> : <ISearch size={size} />}
          />
          <Search open={open} setOpen={setOpen} center={center} onSubmit={setCenter} />
          <Results center={center} />
          <MapBox center={center} />
        </Box>
      )}
    </PageWrapper>
  );
};
