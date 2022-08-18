import MainLayout from 'src/layouts/main';
import { Search } from '../components/Search';
import { Grid, Container } from '@mui/material';
import CityCarousel from '../container/home/CityCarousel';
import berlin from '../images/berlin.jpeg'
import bogota from '../images/bogota.jpeg'
import sydney from '../images/sydney.jpeg'
import taipei from '../images/taipei.jpeg'
import ConferenceCarousel from '../container/home/ConferenceCarousel';

const cities = [
  {
    id: '1',
    city: 'Berlin',
    url: berlin,
    latlon: [52.5170365, 13.3888599],
  },
  {
    id: '2',
    city: 'Bogota',
    url: bogota,
    latlon: [4.6534649, -74.0836453],
  },
  {
    id: '3',
    city: 'Sydney',
    url: sydney,
    latlon: [-33.8698439, 151.208284],
  },
  {
    id: '4',
    city: 'Taipei',
    url: taipei,
    latlon: [25.0375198, 121.5636796],
  }
]

const conferences = [
]
export const Home = () => {
  return (
    <MainLayout>
      <Container maxWidth={'xl'}>
        <Grid container spacing={3}>
          <Search />
          <CityCarousel />
          <ConferenceCarousel />
        </Grid>
      </Container>
    </MainLayout>
  );
};
