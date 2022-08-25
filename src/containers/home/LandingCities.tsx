import { Box, Card, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Image from '../../components/Image';
import berlin from '../../images/cities/berlin.jpeg';
import bogota from '../../images/cities/bogota.jpeg';
import sydney from '../../images/cities/sydney.jpeg';
import taipei from '../../images/cities/taipei.jpeg';

type ItemProps = {
  id: string;
  city: string;
  image: string;
  latlon: number[];
  url: string;
};

const cities = [
  {
    id: '1',
    city: 'Berlin',
    image: berlin,
    url: '/search?roomCount=1&adultCount=2&startDate=2022-09-12T00%3A00%3A00%2B02%3A00&endDate=2022-09-14T00%3A00%3A00%2B02%3A00&location=berlin',
    latlon: [52.5170365, 13.3888599]
  },
  {
    id: '2',
    city: 'Bogotá',
    image: bogota,
    url: '/search?roomCount=1&adultCount=2&startDate=2022-10-07T00%3A00%3A00%2B02%3A00&endDate=2022-10-16T00%3A00%3A00%2B02%3A00&location=Bogota',
    latlon: [4.6534649, -74.0836453]
  },
  {
    id: '3',
    city: 'Sydney',
    image: sydney,
    url: '/search?roomCount=1&adultCount=2&startDate=2022-12-01T00%3A00%3A00%2B01%3A00&endDate=2022-12-04T00%3A00%3A00%2B01%3A00&location=Sydney',
    latlon: [-33.8698439, 151.208284]
  },
  {
    id: '4',
    city: 'Taipei',
    image: taipei,
    url: '/search?roomCount=1&adultCount=2&startDate=2022-12-02T00%3A00%3A00%2B01%3A00&endDate=2022-12-04T00%3A00%3A00%2B01%3A00&location=taipei',
    latlon: [25.0375198, 121.5636796]
  }
];

export default function LandingCities() {
  return (
    <Grid sx={{ pb: 5 }} container xs={12}>
      <Box sx={{ p: 1, position: 'relative' }}>
        <Typography textAlign="center" variant="h3">
          Cities in the spotlight
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {cities.map((item) => (
          <CityItem key={item.id} item={item} />
        ))}
      </Grid>
    </Grid>
  );
}

type CityItemProps = {
  item: ItemProps;
};

function CityItem({ item }: CityItemProps) {
  const navigate = useNavigate();
  const { city, image, url } = item;

  return (
    <Grid item xs={6} md={3} lg={3}>
      <Card onClick={() => navigate(url)} sx={{ pb: 1, borderRadius: 2, bgcolor: 'background.neutral' }}>
        <Box sx={{ p: 1, position: 'relative' }}>
          <Image src={image} ratio="3/4" sx={{ borderRadius: 1.5 }} />
        </Box>
        <Typography textAlign="center" variant="subtitle1">
          {city}
        </Typography>
      </Card>
    </Grid>
  );
}
