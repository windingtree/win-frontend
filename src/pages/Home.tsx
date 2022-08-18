import MainLayout from 'src/layouts/main';
import { Search } from '../components/Search';
import { Grid, Container } from '@mui/material';
import CityCarousel from '../container/home/CityCarousel';
import ConferenceCarousel from '../container/home/ConferenceCarousel';

export const Home = () => {
  return (
    <MainLayout>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Search />
          </Grid>
          <CityCarousel />
          <ConferenceCarousel />
        </Grid>
      </Container>
    </MainLayout>
  );
};
