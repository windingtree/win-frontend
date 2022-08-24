import { MapBox } from '../components/MapBox';
import { Results } from '../components/Results';
import MainLayout from 'src/layouts/main';
import { Box, styled } from '@mui/material';
import { HEADER } from 'src/config/componentSizes';
import { SearchForm } from 'src/containers/search/SearchForm';

const SearchBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: HEADER.MOBILE_HEIGHT,
  width: '100%',
  [theme.breakpoints.up('md')]: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    top: HEADER.MAIN_DESKTOP_HEIGHT + 16
  }
}));

//TODO: remove the footer
export const Search = () => {
  return (
    <MainLayout childrenBelowHeader={false}>
      <Box style={{ position: 'relative' }}>
        <Results />
        <MapBox />
        <SearchBox>
          <SearchForm searchAfterInitialRender />
        </SearchBox>
      </Box>
    </MainLayout>
  );
};
