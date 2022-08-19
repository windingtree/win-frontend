import MainLayout from 'src/layouts/main';
import { Search } from '../components/Search';
import { Grid, Container } from '@mui/material';
import LandingCities from '../container/home/LandingCities';
import LandingConferences from '../container/home/LandingConferences';

export const Home = () => {
  return (
    <MainLayout>
      <Container maxWidth="xl">
        <Grid sx={{ pb: 5 }} container xs={12}>
          <Search />
        </Grid>
        <LandingCities />
        <LandingConferences />
      </Container>
    </MainLayout>
  );
};
