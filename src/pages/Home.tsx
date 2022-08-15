import { MainLayout } from '../layouts/MainLayout';
import { Search } from '../components/Search';
import { MapBox } from '../components/MapBox';
import { Box, Button, ResponsiveContext } from 'grommet';
import { useContext, useState } from 'react';
import { Results } from '../components/Results';
import { Search as ISearch, Close } from 'grommet-icons';

export const Home = () => {
  const [open, setOpen] = useState<boolean>(true);
  const size = useContext(ResponsiveContext);
  //TODO: put the Search, Results and MapBox in a container folder
  return (
    <MainLayout kind="full">
      <Box pad="0" style={{ position: 'relative' }}>
        <Button
          margin={size}
          style={{
            position: 'absolute',
            zIndex: '1',
            alignSelf: 'center',
            background: 'white',
            borderRadius: '0.5rem',
            boxShadow:
              'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px'
          }}
          onClick={() => setOpen(!open)}
          justify="end"
          icon={open ? <Close size={size} /> : <ISearch size={size} />}
        />

        <Search open={open} />
        <Results />
        <MapBox />
      </Box>
    </MainLayout>
  );
};
