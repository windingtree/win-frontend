import MainLayout from 'src/layouts/main';
import { Search } from '../components/Search';
import { Grid, Container } from '@mui/material';
import CityCarousel from '../components/CityCarousel';
import berlin from '../images/berlin.jpeg'
import BookingNewestBooking from '../components/BookingNewestBooking';
import { _bookingNew } from '../mock';

const cities = [
  {
    id: '1',
    city: 'Berlin',
    url: berlin,
    latlon: [1, 1],
  },
  {
    id: '2',
    city: 'B',
    url: berlin,
    latlon: [2, 2],
  },
  {
    id: '3',
    city: 'A',
    url: berlin,
    latlon: [1, 1],
  },
  {
    id: '4',
    city: 'C',
    url: berlin,
    latlon: [2, 2],
  },
]


export const Home = () => {
  return (
    <MainLayout>
      <Container maxWidth={'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {/* Navigate to search page after click on search */}
            <Search />
          </Grid>

          <Grid item xs={12}>
            {/* <BookingNewestBooking
              title="Newest Booking"
              subheader="12 Booking"
              list={_bookingNew}
            /> */}
          </Grid>

          <Grid item xs={12}>
            <CityCarousel list={cities} />
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};
