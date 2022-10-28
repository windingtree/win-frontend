import { MapBox } from '../components/MapBox';
import { Results } from '../containers/search/Results';
import MainLayout from 'src/layouts/main';
import { Box, styled } from '@mui/material';
import { SearchForm } from 'src/containers/search/SearchForm';
import { HEADER } from 'src/config/componentSizes';

const SearchBox = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: HEADER.MOBILE_HEIGHT,
  width: '100%',
  zIndex: 9,

  [theme.breakpoints.up('md')]: {
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    top: 16 + HEADER.MAIN_DESKTOP_HEIGHT
  }
}));

//TODO: remove the footer
export const Search = () => {
  return (
    <MainLayout childrenBelowHeader={false} footer={false}>
      <Box style={{ position: 'relative' }}>
        <Results />
        <MapBox />
        <SearchBox>
          <SearchForm closeable={true} />
        </SearchBox>
      </Box>
    </MainLayout>
  );
};
