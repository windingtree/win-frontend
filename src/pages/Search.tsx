import { MapBox } from '../components/MapBox';
import { Results } from '../components/Results';
import MainLayout from 'src/layouts/main';
import { Box, styled } from '@mui/material';
import { SearchForm } from 'src/containers/search/SearchForm';
import { HEADER } from 'src/config/componentSizes';

const SearchBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  width: '100%',
  [theme.breakpoints.up('md')]: {
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
          <SearchForm />
        </SearchBox>
      </Box>
    </MainLayout>
  );
};
