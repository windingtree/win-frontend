import MainLayout from 'src/layouts/main';
<<<<<<< HEAD
import { Box } from 'grommet';
import { SearchForm } from 'src/containers/search/SearchForm';
=======
import { Search } from '../components/Search';
import { Grid, Container } from '@mui/material';
import LandingCities from '../container/home/LandingCities';
import LandingConferences from '../container/home/LandingConferences';
>>>>>>> main

export const Home = () => {
  return (
    <MainLayout>
<<<<<<< HEAD
      <Box pad="0" style={{ position: 'relative' }}>
        {/* Navigate to search page after click on search */}
        <SearchForm />
      </Box>
=======
      <Container maxWidth="xl">
        <Grid sx={{ pb: 5 }} container xs={12}>
          <Search />
        </Grid>
        <LandingCities />
        <LandingConferences />
      </Container>
>>>>>>> main
    </MainLayout>
  );
};
