import { Box, Card, Typography, Grid, useTheme, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Image from '../../components/Image';
import berlin from '../../images/cities/berlin.jpeg';
import bogota from '../../images/cities/bogota.jpeg';
import sydney from '../../images/cities/sydney.jpeg';
import taipei from '../../images/cities/taipei.jpeg';

const Gradient = styled('div')(() => ({
  background:
    'rgba(255, 255, 255, 0) linear-gradient(to bottom, rgba(0, 0, 0, 0) 10%, rgba(0, 0, 0, .1) 40%, rgba(0, 0, 0, .5) 75%, rgba(0, 0, 0, 1) 100%) repeat scroll 0 0',
  width: '100%',
  position: 'absolute',
  height: '200px',
  bottom: 0
}));

type ItemProps = {
  id: string;
  city: string;
  image: string;
  latlon: number[];
  url: string;
};
const today = new Date(new Date().setHours(0, 0, 0, 0));
const tomorrow = new Date(new Date(today).setDate(today.getDate() + 1));
const afterTomorrow = new Date(new Date(today).setDate(today.getDate() + 4)); // 3days after today

const cityDates = {
  berlin: {
    startDate: (new Date('2022-09-12') > today
      ? new Date('2022-09-12')
      : tomorrow
    ).toISOString(),
    endDate: (new Date('2022-09-12') > today
      ? new Date('2022-09-14')
      : afterTomorrow
    ).toISOString()
  },
  bogota: {
    startDate: (new Date('2022-10-07') > today
      ? new Date('2022-10-07')
      : tomorrow
    ).toISOString(),
    endDate: (new Date('2022-10-07') > today
      ? new Date('2022-10-16')
      : afterTomorrow
    ).toISOString()
  },
  sydney: {
    startDate: (new Date('2022-12-01') > today
      ? new Date('2022-12-01')
      : tomorrow
    ).toISOString(),
    endDate: (new Date('2022-12-01') > today
      ? new Date('2022-12-04')
      : afterTomorrow
    ).toISOString()
  },
  taipei: {
    startDate: (new Date('2022-12-02') > today
      ? new Date('2022-12-02')
      : tomorrow
    ).toISOString(),
    endDate: (new Date('2022-12-02') > today
      ? new Date('2022-12-04')
      : afterTomorrow
    ).toISOString()
  }
};

const cities = [
  {
    id: '1',
    city: 'Berlin',
    image: berlin,
    url: `/search?roomCount=1&adultCount=2&startDate=${cityDates['berlin'].startDate}&endDate=${cityDates['berlin'].endDate}&location=Berlin`,
    latlon: [52.5170365, 13.3888599]
  },
  {
    id: '2',
    city: 'Bogotá',
    image: bogota,
    url: `/search?roomCount=1&adultCount=2&startDate=${cityDates['bogota'].startDate}&endDate=${cityDates['bogota'].endDate}&location=Bogota`,
    latlon: [4.6534649, -74.0836453]
  },
  {
    id: '3',
    city: 'Sydney',
    image: sydney,
    url: `/search?roomCount=1&adultCount=2&startDate=${cityDates['sydney'].startDate}&endDate=${cityDates['sydney'].endDate}&location=Sydney`,
    latlon: [-33.8698439, 151.208284]
  },
  {
    id: '4',
    city: 'Taipei',
    image: taipei,
    url: `/search?roomCount=1&adultCount=2&startDate=${cityDates['taipei'].startDate}&endDate=${cityDates['taipei'].endDate}&location=Taipei`,
    latlon: [25.0375198, 121.5636796]
  }
];

export default function LandingCities() {
  return (
    <Grid sx={{ pb: 5 }} container>
      <Box sx={{ p: 1, position: 'relative' }}>
        <Typography variant="h3">Scenic Cities</Typography>
        <Typography color="text.secondary" mb={2}>
          Our current favorite cities to visit and travel to
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
  const theme = useTheme();

  return (
    <Grid item xs={12} sm={6} md={3} lg={3}>
      <Card onClick={() => navigate(url)} sx={{ cursor: 'pointer' }}>
        <Box sx={{ position: 'relative' }}>
          <Image src={image} ratio="3/4" sx={{ borderRadius: 1.5 }} />
          <Gradient />
          <Typography
            textAlign="center"
            variant="h3"
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              color: theme.palette.grey[0]
            }}
          >
            {city}
          </Typography>
        </Box>
      </Card>
    </Grid>
  );
}
