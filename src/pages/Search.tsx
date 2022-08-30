import { MapBox } from '../components/MapBox';
import { Results } from '../components/Results';
import MainLayout from 'src/layouts/main';
import { Box, styled } from '@mui/material';
import { SearchForm } from 'src/containers/search/SearchForm';

const SearchBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  width: '100%',
  [theme.breakpoints.up('md')]: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    top: 16
  }
}));

//TODO: remove the footer
export const Search = () => {
  return (
    <MainLayout>
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
