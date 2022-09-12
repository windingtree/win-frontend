import { MapBox } from '../components/MapBox';
import { Results } from '../components/Results';
import MainLayout from 'src/layouts/main';
import { Box, styled } from '@mui/material';
import { SearchForm } from 'src/containers/search/SearchForm';
import { HEADER } from 'src/config/componentSizes';
import { useAccommodationsAndOffers } from '../hooks/useAccommodationsAndOffers.tsx';
import { InvalidLocationError } from '../hooks/useAccommodationsAndOffers.tsx/helpers';

const SearchBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: HEADER.MOBILE_HEIGHT,
  width: '100%',
  [theme.breakpoints.up('md')]: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    top: 16 + HEADER.MAIN_DESKTOP_HEIGHT
  }
}));

const NoMapBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.common.white
}));

//TODO: remove the footer
export const Search = () => {
  const { error } = useAccommodationsAndOffers();
  const invalidLocation = error instanceof InvalidLocationError;
  return (
    <MainLayout childrenBelowHeader={false} footer={false}>
      <Box style={{ position: 'relative' }}>
        {invalidLocation ? (
          <NoMapBox />
        ) : (
          <>
            <Results />
            <MapBox />
          </>
        )}

        <SearchBox>
          <SearchForm />
        </SearchBox>
      </Box>
    </MainLayout>
  );
};
