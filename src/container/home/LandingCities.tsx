import { Box, Card, BoxProps, Typography, Grid } from '@mui/material';
import Image from '../../components/Image';
import berlin from '../../images/berlin.jpeg';
import bogota from '../../images/bogota.jpeg';
import sydney from '../../images/sydney.jpeg';
import taipei from '../../images/taipei.jpeg';

type ItemProps = {
  id: string;
  city: string;
  image: string;
  latlon: number[];
};

interface Props extends BoxProps {
  title?: string;
  subheader?: string;
}

const cities = [
  {
    id: '1',
    city: 'Berlin',
    image: berlin,
    latlon: [52.5170365, 13.3888599]
  },
  {
    id: '2',
    city: 'Bogota',
    image: bogota,
    latlon: [4.6534649, -74.0836453]
  },
  {
    id: '3',
    city: 'Sydney',
    image: sydney,
    latlon: [-33.8698439, 151.208284]
  },
  {
    id: '4',
    city: 'Taipei',
    image: taipei,
    latlon: [25.0375198, 121.5636796]
  }
];

export default function LandingCities({ sx }: Props) {
  return (
    <Grid sx={{ pb: 5 }} container spacing={4}>
      {cities.map((item) => (
        <CityItem key={item.id} item={item} />
      ))}
    </Grid>
  );
}

type CityItemProps = {
  item: ItemProps;
};

function CityItem({ item }: CityItemProps) {
  const { city, image } = item;

  return (
    <Grid item xs={6} md={3} lg={3}>
      <Card sx={{ pb: 1, borderRadius: 2, bgcolor: 'background.neutral' }}>
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
