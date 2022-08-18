import { SearchForm } from 'src/containers/search/SearchForm';
import { MapBox } from '../components/MapBox';
import { Box } from 'grommet';
import { Results } from '../components/Results';
import MainLayout from 'src/layouts/main';

export const Search = () => {
  return (
    <MainLayout childrenBelowHeader={false}>
      <Box style={{ position: 'relative' }}>
        <Results />
        <MapBox />
        <Box
          background="white"
          style={{ position: 'absolute', bottom: 20, alignSelf: 'center', zIndex: 1 }}
        >
          <SearchForm />
        </Box>
      </Box>
    </MainLayout>
  );
};
